import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import readline from "readline";

// === Topic/domain control ===
const topic = ""; // Set topic here, e.g. "weather", "biology", or "" for unrestricted

const systemMessage = topic
  ? {
      role: "system",
      content: `
You are an expert in ${topic}.
Prefer answering questions related to ${topic}.
If asked something clearly not about ${topic}, kindly : "I am restricted to answering only ${topic}-related questions."
If the question is ambiguous, try to relate your answer to ${topic} if possible, or ask the user to clarify.
`,
    }
  : {
      role: "system",
      content: `
You are a helpful and knowledgeable AI assistant. Answer all questions to the best of your ability, across any topic the user asks about.
`,
    };

// 1. Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash", // free tier
});

// 2. Define a node function
const callModel = async (state) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

// 3. Create graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("chatbot", callModel)
  .addEdge("__start__", "chatbot");

const app = graph.compile();

// 4. Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  `🤖 Gemini LangGraph Chatbot started!${
    topic ? ` Topic steered to "${topic}".` : ""
  } Type 'exit' to quit.`
);

async function ask(state = { messages: [systemMessage] }) {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    const newState = await app.invoke({
      messages: [...state.messages, { role: "user", content: input }],
    });

    const lastMessage = newState.messages[newState.messages.length - 1];
    console.log("AI:", lastMessage.content);

    ask(newState);
  });
}

ask();