export type TriangleKind = "ascending" | "descending" | "symmetrical";
export type StructureKind = TriangleKind | "wedge" | "rectangle" | "pennant" | "unclear";
export type Scenario = "forming" | "up" | "down" | "retest" | "false";
export type Point = { time: number; price: number };
export const illustrationLabel = "Illustrative example—not historical market data.";
export const triangleKinds: TriangleKind[] = ["ascending", "descending", "symmetrical"];
export const patterns: Record<TriangleKind, { name: string; upper: string; lower: string; description: string; interpretation: string }> = {
  ascending: { name: "Ascending", upper: "Horizontal resistance", lower: "Rising support", description: "Swing highs meet approximately horizontal resistance. Swing lows rise toward it, narrowing the range.", interpretation: "Common bullish interpretation—not a guaranteed upside breakout." },
  descending: { name: "Descending", upper: "Falling resistance", lower: "Horizontal support", description: "Swing highs fall toward approximately horizontal support. The lower boundary stays relatively flat as the range contracts.", interpretation: "Common bearish interpretation—not a guaranteed downside breakout." },
  symmetrical: { name: "Symmetrical", upper: "Falling resistance", lower: "Rising support", description: "Swing highs fall while swing lows rise. The two boundaries converge without a horizontal side.", interpretation: "Direction remains unresolved until a break; prior trend provides context." },
};
export const scenarios: { id: Scenario; label: string; observation: string; interpretation: string }[] = [
  { id: "forming", label: "Still forming", observation: "The illustrated swings remain inside the narrowing boundaries. No breakout segment is shown.", interpretation: "A candidate structure is not a directional signal. It can keep forming, break either way or lose its shape." },
  { id: "up", label: "Upward breakout", observation: "The added segment crosses the upper boundary and continues higher within this illustration.", interpretation: "This is one constructed follow-through outcome, not a prediction. A different next segment could return inside; the shape did not require an upward break." },
  { id: "down", label: "Downward breakout", observation: "The added segment crosses the lower boundary and continues lower within this illustration.", interpretation: "Even an ascending triangle can break downward. Illustrated follow-through does not establish a probability or guarantee continuation." },
  { id: "retest", label: "Breakout and retest", observation: "The added segment breaks upward, returns to the extended upper boundary and then moves higher.", interpretation: "This chosen retest holds in the illustration. Retests may fail or never happen; waiting for one can miss a move." },
  { id: "false", label: "False breakout / return inside", observation: "The added segment crosses the upper boundary, then returns between the original boundaries before their apex.", interpretation: "The first break did not sustain. Do not move the original lines to turn this failure into a successful pattern." },
];

// Generic relative-price units, never a fabricated instrument or historical feed.
export function boundary(kind: StructureKind, side: "upper" | "lower", time: number): number {
  const upper = side === "upper";
  switch (kind) {
    case "ascending": return upper ? 78 : 18 + 0.65 * time;
    case "descending": return upper ? 84 - 0.6 * time : 22;
    case "symmetrical": return upper ? 84 - 0.4 * time : 16 + 0.4 * time;
    case "wedge": return upper ? 65 + 0.25 * time : 15 + 0.7 * time;
    case "rectangle": return upper ? 78 : 22;
    case "pennant": return upper ? 87 - 0.35 * (time - 14) : 53 + 0.25 * (time - 14);
    case "unclear": return upper ? 78 : 22;
  }
}
export function historicalPoints(kind: StructureKind): Point[] {
  if (kind === "unclear") return [{ time: 6, price: 38 }, { time: 23, price: 76 }, { time: 44, price: 47 }];
  const times = kind === "pennant" ? [14, 24, 33, 43, 53, 64] : [4, 15, 27, 39, 52, 64];
  const swings = times.map((time, i) => ({ time, price: boundary(kind, i % 2 === 0 ? "upper" : "lower", time) }));
  return kind === "pennant" ? [{ time: 0, price: 16 }, { time: 11, price: 44 }, ...swings] : swings;
}
export function futurePoints(kind: TriangleKind, scenario: Scenario): Point[] {
  const upper = (time: number) => boundary(kind, "upper", time);
  const lower = (time: number) => boundary(kind, "lower", time);
  if (scenario === "forming") return [];
  if (scenario === "up") return [{ time: 70, price: upper(70) + 9 }, { time: 76, price: upper(76) + 6 }, { time: 84, price: upper(76) + 16 }, { time: 94, price: upper(76) + 20 }];
  if (scenario === "down") return [{ time: 70, price: lower(70) - 8 }, { time: 76, price: lower(76) - 5 }, { time: 84, price: lower(76) - 16 }, { time: 94, price: lower(76) - 20 }];
  if (scenario === "retest") return [{ time: 70, price: upper(70) + 10 }, { time: 76, price: upper(76) + 13 }, { time: 80, price: upper(80) }, { time: 84, price: upper(80) + 17 }];
  return [{ time: 68, price: upper(68) + 10 }, { time: 71, price: upper(71) + 4 }, { time: 74, price: (upper(74) + lower(74)) / 2 }];
}
export function toScreen(point: Point): { x: number; y: number } {
  return { x: 54 + point.time * 3.35, y: 245 - point.price * 1.82 };
}
export const revealSteps = [
  { title: "Identify the swing points", text: "Read the completed solid price path. H marks a swing high; L marks a swing low. The next segment is hidden." },
  { title: "Draw the boundaries", text: "Join the illustrated highs and lows consistently. The solid upper line and dashed lower line use the same swing-point method; no later points were used." },
  { title: "Observe the narrowing range", text: "The shaded range contracts between the boundaries. That geometry alone cannot tell you what the next segment will do." },
  { title: "Reveal the next segment", text: "The dashed gold segment, if present, is a constructed scenario added to the original drawing. It is not a live forecast." },
  { title: "Discuss the result", text: "Separate what this illustration shows from what might happen in another sequence. A boundary break and sustained follow-through are different observations." },
];
export const exercises: { kind: StructureKind; answer: string; explanation: string }[] = [
  { kind: "ascending", answer: "Ascending triangle", explanation: "The upper boundary is approximately horizontal and the swing lows rise. No breakout is visible; either-direction breaks remain possible." },
  { kind: "descending", answer: "Descending triangle", explanation: "Swing highs fall toward horizontal support. This is a still-forming illustration, not a guaranteed downward signal." },
  { kind: "symmetrical", answer: "Symmetrical triangle", explanation: "Highs fall and lows rise between opposite-sloping boundaries. The next direction is unresolved." },
  { kind: "wedge", answer: "Wedge", explanation: "Both boundaries rise, with the lower one rising faster. They converge in the same direction, unlike this guide’s symmetrical triangles." },
  { kind: "unclear", answer: "Unclear / insufficient evidence", explanation: "Only one high and two other points are available. Many lines could fit; there is not enough repeated structure to identify a triangle confidently." },
];
const scale = BigInt(100000000);
const parsePrice = (value: string): bigint | null => {
  if (!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,8})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().split(".");
  const result = BigInt(whole) * scale + BigInt(fraction.padEnd(8, "0"));
  return result > BigInt(0) ? result : null;
};
function formatPrice(value: bigint, precision: number): string {
  const fraction = (value % scale).toString().padStart(8, "0").slice(0, precision);
  return `${value / scale}.${fraction}`;
}
export type MeasuredMove = { ok: true; height: string; target: string } | { ok: false; field: "upper" | "lower" | "reference" | "direction"; error: string };
export function measuredMove(upperInput: string, lowerInput: string, referenceInput: string, direction: string): MeasuredMove {
  const values = { upper: parsePrice(upperInput), lower: parsePrice(lowerInput), reference: parsePrice(referenceInput) };
  for (const field of ["upper", "lower", "reference"] as const) if (values[field] === null) return { ok: false, field, error: "Enter a positive price: up to 9 whole digits and 8 decimal places. Exponents and separators are not supported." };
  if (!["up", "down"].includes(direction)) return { ok: false, field: "direction", error: "Choose upward or downward." };
  const upper = values.upper!, lower = values.lower!, reference = values.reference!;
  if (upper <= lower) return { ok: false, field: "upper", error: "Upper price must be greater than lower price at the same measurement point." };
  const height = upper - lower;
  const target = direction === "up" ? reference + height : reference - height;
  if (target <= BigInt(0)) return { ok: false, field: "reference", error: "The downside reference is zero or negative. Choose a breakout reference above the measured height." };
  const precision = Math.max(4, ...[upperInput, lowerInput, referenceInput].map(input => input.trim().split(".")[1]?.length ?? 0));
  return { ok: true, height: formatPrice(height, precision), target: formatPrice(target, precision) };
}
