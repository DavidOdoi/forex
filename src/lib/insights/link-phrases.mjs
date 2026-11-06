/**
 * Add only the explicitly chosen editorial anchors, preserving the visible text.
 * Longer phrases win when labels overlap; parts of another word never match.
 * @param {string} text
 * @param {{text: string, href: string}[]} [anchors]
 * @returns {{text: string, href?: string}[]}
 */
export function linkPhrases(text, anchors = []) {
  if (!anchors.length) return [{ text }];
  for (const anchor of anchors) {
    if (!anchor.text || !/^(?:https:\/\/|\/(?!\/)|#)/.test(anchor.href)) {
      throw new Error("Editorial links require nonempty text and a safe destination");
    }
  }
  const labels = [...new Set(anchors.map(anchor => anchor.text))].sort((a, b) => b.length - a.length);
  const escaped = labels.map(label => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${escaped.join("|")})(?![\\p{L}\\p{N}_])`, "giu");
  /** @type {{text: string, href?: string}[]} */
  const result = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    if (cursor < start) result.push({ text: text.slice(cursor, start) });
    const anchor = anchors.find(anchor => anchor.text.toLocaleLowerCase("en") === match[0].toLocaleLowerCase("en"));
    result.push({ text: match[0], href: anchor?.href });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) result.push({ text: text.slice(cursor) });
  return result;
}
