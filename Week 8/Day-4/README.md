# LangGraph Mini Chatbot with Calculator (JavaScript)

Explicit branching LangGraph app that routes inputs to either a local calculator (mathjs) or Gemini via `@langchain/google-genai`. Includes graph visualization using Graphviz.

## Files

- `index.js` — nodes (`router`, `calculator`, `chatbot`), routing, REPL, DOT export
- `visualize.js` — generates `langgraph.dot` and renders SVG/PNG/PDF via Graphviz
- `langgraph.*` — generated visualization outputs

## Prerequisites

- Node.js 18+
- Gemini API key
- (Optional) Graphviz installed for rendering images

## Graphviz installation

- Windows: `winget install graphviz`
- macOS: `brew install graphviz`
- Linux (Debian/Ubuntu): `sudo apt install graphviz`

## Setup commands

```bash
# 1) Install dependencies (from project root)
npm install

# If you need to install from scratch explicitly
npm i dotenv @langchain/langgraph @langchain/google-genai mathjs

# 2) Create .env with your API key (one of these)
echo GOOGLE_API_KEY=your_key_here > .env
# or
echo GEMINI_API_KEY=your_key_here > .env

# 3) Run interactive REPL
node index.js

# 4) One-off CLI invocation
node index.js "(3+2)!"

# 5) Generate DOT and SVG/PNG/PDF (requires Graphviz)
node visualize.js           # default: SVG
node visualize.js --png     # PNG
node visualize.js --pdf     # PDF
node visualize.js --all     # SVG, PNG, PDF
```

## Notes

- Calculator supports operators/functions recognized by mathjs (including `!`, unicode × ÷ −, word operators like “plus”, “minus”, “mul”, “div”, and `**` normalized to `^`).
- Router detects math by parsing with mathjs and allowing only math-related symbols; otherwise it routes to Gemini.
