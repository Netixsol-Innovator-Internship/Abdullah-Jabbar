import { create, all } from "mathjs";
const math = create(all);

export let lastAnswer = null; // stores last successful calculator result

// Normalize common input variants to mathjs-friendly form
export function normalizeInput(input) {
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

export function applyAnswerMemory(expr) {
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

export function looksLikeMath(s) {
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

export function calcResultString(expr) {
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