// Helper to extract plain text for REPL printing & diagnostics
export function extractText(msg) {
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