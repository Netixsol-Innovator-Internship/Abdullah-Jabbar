import readline from "readline";
import { exportDot } from "./graph-builder.js";
import { extractText } from "./utils.js";
import { systemMessage } from "./config.js";
import path from "path";

export function createREPL(app) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  console.log(
    `🤖 LangGraph Chatbot started! Using model: ${process.env.GOOGLE_MODEL || "gemini-2.0-flash"}. Type 'exit' to quit.`
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

  return { ask };
}