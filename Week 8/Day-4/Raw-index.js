#!/usr/bin/env node
/**
 * Minimal LangGraph chatbot with simplified routing.
 * - Uses gemini-2.0-flash (default) via ChatGoogleGenerativeAI.
 * - Calculator handles simple arithmetic locally via mathjs.
 * - Single node handles routing internally.
 * - Logs raw model.invoke responses for debugging and prints only assistant text in the REPL.
 *
 * Usage:
 *  npm install dotenv @langchain/langgraph @langchain/google-genai mathjs
 *  Add .env with GEMINI_API_KEY=your_key_here (or GOOGLE_API_KEY)
 *  node index.js
 *  node index.js --visualize
 */

import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import readline from "readline";
import fs from "fs";
import path from "path";
import { create, all } from "mathjs";
const math = create(all);
let lastAnswer = null; // stores last successful calculator result

const systemMessage = {
  role: "system",
  content: "You are a helpful assistant.",
};

const GOOGLE_API_KEY =
  process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || null;
const MODEL = process.env.GOOGLE_MODEL || "gemini-2.0-flash";

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: MODEL,
});

// --- math detection and evaluation ---
// Normalize common input variants to mathjs-friendly form
function normalizeInput(input) {
  if (typeof input !== "string") return "";
  return (
    input
      .replace(/\*\*/g, "^") // JS exponent to mathjs
      .replace(/[×✕]/g, "*") // unicode multiply
      .replace(/[÷]/g, "/") // unicode divide
      .replace(/[−–—]/g, "-") // unicode minus/dash variants
      // words to operators (case-insensitive, word boundaries)
      .replace(/\bdiv(?:ide|ided)?(?:\s+by)?\b/gi, "/")
      .replace(/\bmult(?:iply|iplied)?(?:\s+by)?\b/gi, "*")
      .replace(/\btimes(?:\s+by)?\b/gi, "*")
      .replace(/\bto\s+the\s+power\s+of\b/gi, "^")
      .replace(/\bpower\s+of\b/gi, "^")
      .replace(/\bpower\b/gi, "^")
      .replace(/\bpow\b/gi, "^")
      .replace(/\bplus\b/gi, "+")
      .replace(/\bminus\b/gi, "-")
      .replace(/\bmul\b/gi, "*")
      .replace(/\bover\b/gi, "/")
      .replace(/\bmod(?:ulo)?\b/gi, "%")
      // remove thousands separators like 1,234,567 (but keep commas in function args)
      .replace(/(\d),(?=\d{3}(\D|$))/g, "$1")
      .trim()
  );
}

function applyAnswerMemory(expr) {
  const s = expr.trim();
  if (s.length === 0) return s;
  // Substitute explicit 'ans'/'answer'
  let withAns = s;
  if (lastAnswer !== null) {
    withAns = withAns.replace(/\b(ans|answer)\b/gi, String(lastAnswer));
  }
  // If starts with operator, prefix last answer
  if (lastAnswer !== null) {
    if (/^[+\-*/^%]/.test(withAns)) {
      return `${lastAnswer} ${withAns}`;
    }
  }
  return withAns;
}

// Allowlist of symbol/function names considered mathy
const ALLOWED_SYMBOLS = new Set([
  // constants
  "e",
  "E",
  "pi",
  "PI",
  "tau",
  "TAU",
  "i",
  "Infinity",
  "NaN",
  // arithmetic helpers
  "abs",
  "add",
  "subtract",
  "multiply",
  "divide",
  "mod",
  "pow",
  // trig
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "atan2",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  // roots & logs
  "sqrt",
  "cbrt",
  "log",
  "log10",
  "ln",
  "exp",
  // rounding
  "round",
  "floor",
  "ceil",
  "fix",
  // stats
  "min",
  "max",
  "mean",
  "median",
  "sum",
  "prod",
  "variance",
  "std",
  // combinatorics
  "factorial",
  "permutations",
  "combinations",
  // matrices & vectors (safe to allow)
  "matrix",
  "det",
  "transpose",
  "size",
  // random
  "random",
  "rand",
  "randomInt",
]);

function looksLikeMath(s) {
  if (!s || typeof s !== "string") return false;
  const t = normalizeInput(s);
  if (!t) return false;
  // If input refers to previous answer or starts with an operator, treat as math
  if (/\b(ans|answer)\b/i.test(s)) return true;
  if (/^[+\-*/^%]/.test(t)) return true;
  try {
    const node = math.parse(t);
    const symbols = [];
    node.traverse((n) => {
      if (n && n.isSymbolNode) symbols.push(n.name);
    });
    if (symbols.length > 0) {
      return symbols.every((name) => ALLOWED_SYMBOLS.has(name));
    }
    return true;
  } catch {
    return false;
  }
}
function calcResultString(expr) {
  try {
    const normalized = normalizeInput(String(expr));
    const withMemory = applyAnswerMemory(normalized);
    if (
      (/\b(ans|answer)\b/i.test(normalized) || /^[+\-*/^%]/.test(normalized)) &&
      lastAnswer === null
    ) {
      return "Calculator error: no previous answer available";
    }
    const result = math.evaluate(withMemory);
    lastAnswer = result;
    console.log("_____________Calculator______________");
    return `${withMemory} = ${result}`;
  } catch (err) {
    return `Calculator error: ${err?.message ?? String(err)}`;
  }
}

// Helper to extract plain text for REPL printing & diagnostics
function extractText(msg) {
  if (!msg) return "";
  if (typeof msg === "string") return msg;
  if (typeof msg.content === "string") return msg.content;
  if (Array.isArray(msg.content) && msg.content[0]?.text) {
    return msg.content[0].text;
  }
  if (msg.message) return msg.message;
  if (msg.output) return msg.output;
  if (msg.text) return msg.text;
  try {
    const s = JSON.stringify(msg);
    return s.length > 1000 ? s.slice(0, 1000) + "..." : s;
  } catch {
    return "";
  }
}

// --- branching nodes ---
// Router node: decide which branch to take based on the latest user message
async function routerNode(state) {
  // pass-through; decision happens in addConditionalEdges
  return state;
}

// Calculator node: evaluate math locally
async function calculatorNode(state) {
  const msgs = state.messages ?? [];
  const last = msgs[msgs.length - 1];
  const userInput = extractText(last) ?? "";
  return {
    messages: [
      ...msgs,
      { role: "assistant", content: calcResultString(userInput) },
    ],
  };
}

// Chatbot node: call Gemini
async function chatbotNode(state) {
  const msgs = state.messages ?? [];
  let response;
  try {
    response = await model.invoke(msgs);
  } catch (err) {
    const errMsg = `[LLM invoke error] ${err?.message ?? String(err)}`;
    console.error(err);
    return { messages: [...msgs, { role: "assistant", content: errMsg }] };
  }
  const text = extractText(response);
  if (!text || String(text).trim() === "") {
    const diag =
      "[LLM returned an empty message — see console for raw response]";
    return { messages: [...msgs, { role: "assistant", content: diag }] };
  }
  return { messages: [...msgs, { role: "assistant", content: String(text) }] };
}

// --- build graph with explicit branching ---
const graph = new StateGraph(MessagesAnnotation)
  .addNode("router", routerNode)
  .addNode("calculator", calculatorNode)
  .addNode("chatbot", chatbotNode)
  .addEdge("__start__", "router")
  .addConditionalEdges(
    "router",
    (state) => {
      const msgs = state.messages ?? [];
      const last = msgs[msgs.length - 1];
      const userInput = extractText(last) ?? "";
      const normalized = normalizeInput(userInput);
      const referencesPrev =
        /\b(ans|answer)\b/i.test(normalized) || /^[+\-*/^%]/.test(normalized);
      if (referencesPrev && lastAnswer === null) {
        return "chatbot";
      }
      const isMath = looksLikeMath(userInput);
      return isMath ? "calculator" : "chatbot";
    },
    {
      calculator: "calculator",
      chatbot: "chatbot",
    }
  )
  .addEdge("calculator", "__end__")
  .addEdge("chatbot", "__end__");

const app = graph.compile();

// --- DOT export ---
function exportDot(name = "langgraph") {
  const dot = `digraph LangGraph {
  rankdir=LR;
  "__start__" [shape=oval,label="Start"];
  "router" [shape=diamond,label="Router\\n(math? yes/no)"];
  "calculator" [shape=box,label="Calculator"];
  "chatbot" [shape=box,label="Gemini Chatbot"];
  "__end__" [shape=oval,label="End"];

  "__start__" -> "router";
  "router" -> "calculator" [label="math"];
  "router" -> "chatbot" [label="not math"];
  "calculator" -> "__end__";
  "chatbot" -> "__end__";
}`;
  const p = path.resolve(`${name}.dot`);
  fs.writeFileSync(p, dot, "utf8");
  return p;
}

// --- REPL ---
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log(
  `🤖 LangGraph Chatbot started! Using model: ${MODEL}. Type 'exit' to quit.`
);

async function ask(state = { messages: [systemMessage] }) {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    if (input === "--visualize") {
      const p = exportDot("langgraph");
      console.log(
        `Graph DOT written to: ${p} (render: dot -Tsvg ${path.basename(
          p
        )} -o langgraph.svg)`
      );
      return ask(state);
    }

    const newState = await app.invoke({
      messages: [...(state.messages || []), { role: "user", content: input }],
    });

    const last = newState.messages[newState.messages.length - 1];
    console.log("AI:", extractText(last));

    ask(newState);
  });
}

if (process.argv.length > 2) {
  const arg = process.argv.slice(2).join(" ");
  if (arg === "--visualize") {
    const p = exportDot("langgraph");
    console.log(`Graph DOT written to: ${p}`);
    process.exit(0);
  }
  (async () => {
    const newState = await app.invoke({
      messages: [systemMessage, { role: "user", content: arg }],
    });
    const last = newState.messages[newState.messages.length - 1];
    console.log("AI:", extractText(last));
    process.exit(0);
  })();
} else {
  ask();
}
