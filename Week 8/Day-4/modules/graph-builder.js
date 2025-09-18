import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { routerNode, calculatorNode, chatbotNode, routeCondition } from "./graph-nodes.js";
import fs from "fs";
import path from "path";

export function buildGraph() {
  const graph = new StateGraph(MessagesAnnotation)
    .addNode("router", routerNode)
    .addNode("calculator", calculatorNode)
    .addNode("chatbot", chatbotNode)
    .addEdge("__start__", "router")
    .addConditionalEdges(
      "router",
      routeCondition,
      {
        calculator: "calculator",
        chatbot: "chatbot",
      }
    )
    .addEdge("calculator", "__end__")
    .addEdge("chatbot", "__end__");

  return graph.compile();
}

export function exportDot(name = "langgraph") {
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