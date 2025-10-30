export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function buildTf(doc: string) {
  const tokens = tokenize(doc);
  const tf: Record<string, number> = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  const len = tokens.length || 1;
  for (const k of Object.keys(tf)) tf[k] = tf[k] / len;
  return tf;
}

export function cosine(tf1: Record<string, number>, tf2: Record<string, number>) {
  let dot = 0;
  let n1 = 0;
  let n2 = 0;
  const keys = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  for (const k of keys) {
    const v1 = tf1[k] || 0;
    const v2 = tf2[k] || 0;
    dot += v1 * v2;
    n1 += v1 * v1;
    n2 += v2 * v2;
  }
  if (n1 === 0 || n2 === 0) return 0;
  return dot / (Math.sqrt(n1) * Math.sqrt(n2));
}

export function rankDocsByQuery(docs: { content: string; [k: string]: any }[], query: string) {
  const qtf = buildTf(query);
  const out = docs.map(d => ({ doc: d, score: cosine(buildTf(d.content || ''), qtf) }));
  out.sort((a, b) => b.score - a.score);
  return out;
}

export function extractiveSummarize(text: string, maxSentences = 3) {
  if (!text) return '';
  const sents = text.split(/(?<=[.?!\n])\s+/).map(s => s.trim()).filter(Boolean);
  if (sents.length <= maxSentences) return sents.join(' ');
  const tf = buildTf(text);
  const scored = sents.map(s => ({ s, score: cosine(buildTf(s), tf) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxSentences).map(x => x.s).join(' ');
}
