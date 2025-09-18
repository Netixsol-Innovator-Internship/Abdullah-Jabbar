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

import { buildGraph, exportDot } from "./modules/graph-builder.js";
import { createREPL } from "./modules/repl.js";
import { extractText } from "./modules/utils.js";
import { systemMessage } from "./modules/config.js";

const app = buildGraph();

// Handle command line arguments
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
  const repl = createREPL(app);
  repl.ask();
}

// Export for external use (like visualize.js)
export { app, exportDot };