import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { extractText } from "./utils.js";
import { calcResultString, looksLikeMath, normalizeInput, lastAnswer } from "./math-utils.js";
import { GOOGLE_API_KEY, MODEL } from "./config.js";

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: MODEL,
});

// Router node: decide which branch to take based on the latest user message
export async function routerNode(state) {
  // pass-through; decision happens in addConditionalEdges
  return state;
}

// Calculator node: evaluate math locally
export async function calculatorNode(state) {
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
export async function chatbotNode(state) {
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

// Branching condition function
export function routeCondition(state) {
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
}