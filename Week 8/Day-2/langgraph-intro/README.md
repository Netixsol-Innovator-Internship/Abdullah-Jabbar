# LangGraph Day 2: Gemini Chatbot

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/langgraph-day2.git
   cd langgraph-day2
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Add a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. Run the chatbot:
   ```sh
   node index.js
   ```

## Features

- Topic-restricted or general chatbot using Gemini API
- Conversation memory (remembers previous turns)
- Runs in terminal

## LangGraph Concepts

- Graph-based conversational flow
- Nodes for function execution
- Edges for flow control
- State for memory

## Why LangGraph?

LangGraph provides flexible, modular, and scalable conversation flows compared to LangChain. It's ideal for multi-turn, dynamic dialogs and complex logic.
