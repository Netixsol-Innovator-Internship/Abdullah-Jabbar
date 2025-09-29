// Minimal ambient module declaration to allow dynamic import of an optional
// runtime-only "langgraph" package. Consumers should still install a real
// langgraph client when using GEMINI_API_KEY.
declare module 'langgraph';
