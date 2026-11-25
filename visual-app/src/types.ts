/** Colour families used across the diagram. Each maps to Tailwind classes in tones.ts. */
export type Tone = "slate" | "sky" | "violet" | "emerald" | "amber" | "rose";

/** One rule describing how a piece talks to another piece. */
export interface ConnectionRule {
  /** The other end of the connection (a human-readable name). */
  peer: string;
  /** "in" = peer calls this piece, "out" = this piece calls the peer, "both" = two-way. */
  direction: "in" | "out" | "both";
  /** Protocol used on the wire, e.g. "HTTPS". */
  protocol: string;
  /** Port number(s), e.g. "443". */
  port: string;
  /** The exact rule: what must be true for the connection to work. */
  rule: string;
}

/**
 * Everything a learner needs about one thing: a box, an arrow or an era.
 * Every field is shown in full in the detail panel, so nothing here is a summary.
 */
export interface Concept {
  name: string;
  aliases: string[];
  oneLiner: string;
  /** Beginner explanation in plain English. */
  plain: string[];
  /** A real-world analogy. */
  analogy: string;
  /** Why it exists: the pain it removes. */
  why: string;
  /** Its job inside the FoodDash food delivery app. */
  foodDash: string;
  /** Exact connection rules: who talks to whom, how, on which port. */
  connections: ConnectionRule[];
  /** Deeper, advanced-level notes. */
  advanced: string[];
  /** Exact facts: numbers, ports, CIDR blocks, ARNs, limits. Shown in monospace. */
  facts: string[];
  /** Mistakes beginners commonly make. */
  mistakes?: string[];
}

export type NodeKind = "zone" | "node" | "badge" | "stack";

export interface DiagramNode {
  id: string;
  /** Key into CONCEPTS. */
  concept: string;
  kind: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  sub2?: string;
  tone: Tone;
  /** For "stack" nodes: inner rows drawn as layers (app, OS, hardware). */
  rows?: string[];
  /** For "stack" nodes: CPU utilization bar, 0..100. */
  bar?: number;
  /** "rush" nodes fade in and out to show auto scaling. */
  pulse?: "rush" | "glow";
  /** Draw an animated billing meter inside the node (Era 5). */
  meter?: boolean;
}

export interface DiagramEdge {
  id: string;
  /** Key into CONCEPTS. */
  concept: string;
  /** SVG path in the 1000 x 520 diagram space. */
  d: string;
  tone: Tone;
  label?: string;
  labelAt?: [number, number];
  dashed?: boolean;
  arrow?: boolean;
  /** Only visible during the lunch rush (Era 3). */
  pulse?: "rush";
}

export interface WalkStep {
  title: string;
  text: string;
  /** Node ids to highlight. Empty = everything normal. */
  focus: string[];
  /** Edge ids that carry animated packets in this step, in order. */
  edges: string[];
}

export interface Era {
  id: string;
  icon: string;
  year: string;
  name: string;
  title: string;
  when: string;
  tone: Tone;
  /** Key into CONCEPTS for the full era explanation. */
  concept: string;
  stats: [string, string][];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: WalkStep[];
}
