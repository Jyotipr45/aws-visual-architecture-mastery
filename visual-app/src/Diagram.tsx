import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CUSTOMER } from "./eras";
import { TONE } from "./tones";
import type { DiagramEdge, DiagramNode, Era, Tone } from "./types";

const W = 1000;
const H = 520;
const spring = { type: "spring" as const, stiffness: 260, damping: 24 };

export interface DiagramProps {
  era: Era;
  stepIndex: number;
  playing: boolean;
  speed: number;
  selectedId: string | null;
  onSelect: (id: string, concept: string) => void;
}

/* ------------------------------------------------------------------ Packet */
/** A glowing dot that travels along an SVG path. Pauses and changes speed with the controls. */
function Packet({ d, tone, delay, cycle, playing, speed }: { d: string; tone: Tone; delay: number; cycle: number; playing: boolean; speed: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const t = useRef(0);
  const travel = 0.9; // seconds to cross one connection at 1x

  useAnimationFrame((_, delta) => {
    if (playing) t.current += (Math.min(delta, 64) / 1000) * speed;
    const p = pathRef.current, g = dotRef.current;
    if (!p || !g) return;
    const local = (t.current % cycle) - delay;
    if (local < 0 || local > travel) { g.setAttribute("opacity", "0"); return; }
    const u = local / travel;
    const ease = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const pt = p.getPointAtLength(ease * p.getTotalLength());
    g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    g.setAttribute("opacity", "1");
  });

  return (
    <g pointerEvents="none">
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      <g ref={dotRef} opacity={0}>
        <circle r={11} className={TONE[tone].dot} opacity={0.22} />
        <circle r={5.5} className={TONE[tone].dot} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ Nodes */
function NodeShape({ n, dim, focused, selected, playing, speed, onSelect }: {
  n: DiagramNode; dim: boolean; focused: boolean; selected: boolean; playing: boolean; speed: number;
  onSelect: (id: string, concept: string) => void;
}) {
  const tone = TONE[n.tone];
  const cx = n.x + n.w / 2;
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(n.id, n.concept); }
  };
  const common = {
    role: "button", tabIndex: 0, "aria-label": `${n.title}: open details`,
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onSelect(n.id, n.concept); },
    onKeyDown: handleKey, className: "cursor-pointer outline-none focus-visible:[&>rect:first-of-type]:stroke-[3]",
  };
  const strokeW = selected ? 3 : focused ? 2.4 : 1.5;

  // Rush nodes fade in and out (auto scaling) unless the current step focuses them.
  const rushAnim = n.pulse === "rush" && !focused
    ? (playing ? { opacity: [0.16, 0.16, 1, 1, 0.16] } : { opacity: 0.16 })
    : { opacity: dim ? 0.42 : 1 };
  const rushTrans = n.pulse === "rush" && !focused && playing
    ? { duration: 7 / speed, repeat: Infinity, times: [0, 0.3, 0.42, 0.78, 0.9], ease: "easeInOut" as const }
    : { duration: 0.35 };

  if (n.kind === "zone") {
    return (
      <motion.g {...common} animate={{ opacity: dim ? 0.55 : 1 }} transition={{ duration: 0.35 }}>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={18} className={`${tone.zoneFill} ${tone.stroke}`} strokeWidth={selected ? 2.5 : 1.5} strokeDasharray="7 6" strokeOpacity={0.7} />
        <text x={n.x + 18} y={n.y + 26} className={`${tone.label} text-[13px] font-bold`}>{n.title}</text>
      </motion.g>
    );
  }

  if (n.kind === "badge") {
    return (
      <motion.g {...common} animate={rushAnim} transition={rushTrans}>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} className={`fill-white dark:fill-slate-900 ${tone.stroke}`} strokeWidth={strokeW} />
        <text x={cx} y={n.y + n.h / 2 + 4} textAnchor="middle" className="t2 fill-slate-700 dark:fill-slate-200">{n.title}</text>
      </motion.g>
    );
  }

  if (n.kind === "stack") {
    const rows = n.rows ?? [];
    let ry = n.y + 62;
    return (
      <motion.g {...common} animate={{ opacity: dim ? 0.42 : 1 }} transition={{ duration: 0.35 }}>
        <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} className={`${tone.fill} ${tone.stroke}`} strokeWidth={strokeW} />
        <text x={cx} y={n.y + 28} textAnchor="middle" className="t1 fill-slate-800 dark:fill-slate-100">{n.title}</text>
        {n.sub && <text x={cx} y={n.y + 46} textAnchor="middle" className="t3 fill-slate-500 dark:fill-slate-400">{n.sub}</text>}
        {rows.map((r, i) => {
          const h = i === 0 ? 38 : 30;
          const el = (
            <g key={r}>
              <rect x={n.x + 16} y={ry} width={n.w - 32} height={h} rx={8} className={i === 0 ? "fill-slate-500/15" : "fill-slate-500/[0.07]"} />
              <text x={cx} y={ry + h / 2 + 4} textAnchor="middle" className={i === 0 ? "t2 fill-slate-800 dark:fill-slate-100" : "t3 fill-slate-500 dark:fill-slate-400"}>{r}</text>
            </g>
          );
          ry += h + 8;
          return el;
        })}
        {n.bar !== undefined ? (
          <g>
            <text x={n.x + 16} y={n.y + 212} className="t3 fill-slate-500 dark:fill-slate-400">CPU used: {n.bar}%</text>
            <rect x={n.x + 16} y={n.y + 218} width={104} height={8} rx={4} className="fill-slate-500/20" />
            <motion.rect x={n.x + 16} y={n.y + 218} height={8} rx={4} className="fill-rose-500" initial={{ width: 0 }} animate={{ width: (104 * n.bar) / 100 }} transition={{ ...spring, delay: 0.4 }} />
            <text x={n.x + 16} y={n.y + 244} className="t3 fill-rose-600 dark:fill-rose-400">{100 - n.bar}% idle</text>
            <g transform={`translate(${n.x + n.w - 40} ${n.y + 222})`}>
              <circle r={15} fill="none" className={tone.stroke} strokeOpacity={0.5} />
              <motion.path d="M0-11 L3-2 L11 0 L2 3 L0 11 L-3 2 L-11 0 L-2-3z" className={tone.dot} fillOpacity={0.7}
                animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={playing ? { duration: 1.2 / speed, repeat: Infinity, ease: "linear" } : { duration: 0 }} />
            </g>
          </g>
        ) : (
          <text x={cx} y={n.y + n.h - 20} textAnchor="middle" className="t3 fill-slate-500 dark:fill-slate-400">isolated from neighbours</text>
        )}
      </motion.g>
    );
  }

  // Standard node
  const lines = [n.title, n.sub, n.sub2].filter(Boolean).length;
  const top = n.y + n.h / 2 - (lines - 1) * 9 + 5;
  return (
    <motion.g {...common} animate={rushAnim} transition={rushTrans}>
      {focused && (
        <motion.rect x={n.x - 5} y={n.y - 5} width={n.w + 10} height={n.h + 10} rx={16} fill="none" className={tone.stroke} strokeWidth={2}
          animate={{ opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 1.8, repeat: Infinity }} />
      )}
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} className={`${tone.fill} ${tone.stroke}`} strokeWidth={strokeW} />
      {n.pulse === "glow" && (
        <motion.rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} className={tone.dot} pointerEvents="none"
          animate={playing ? { opacity: [0, 0, 0.2, 0.2, 0] } : { opacity: 0 }}
          transition={playing ? { duration: 4 / speed, repeat: Infinity, times: [0, 0.35, 0.42, 0.7, 0.8] } : { duration: 0.2 }} />
      )}
      {n.meter ? (
        <g>
          <text x={n.x + 20} y={n.y + 32} className="t1 fill-slate-800 dark:fill-slate-100">{n.title}</text>
          <text x={n.x + n.w - 20} y={n.y + 32} textAnchor="end" className="t3 fill-slate-500 dark:fill-slate-400">{n.sub}</text>
          <rect x={n.x + 20} y={n.y + 50} width={n.w - 40} height={12} rx={6} className="fill-slate-500/20" />
          <motion.rect x={n.x + 20} y={n.y + 50} height={12} rx={6} className={tone.dot}
            animate={playing ? { width: [0, 0, n.w - 40, n.w - 40, 0] } : { width: 0 }}
            transition={playing ? { duration: 4 / speed, repeat: Infinity, times: [0, 0.4, 0.75, 0.95, 1], ease: "linear" } : { duration: 0.2 }} />
        </g>
      ) : (
        <>
          <text x={cx} y={top} textAnchor="middle" className="t1 fill-slate-800 dark:fill-slate-100">{n.title}</text>
          {n.sub && <text x={cx} y={top + 18} textAnchor="middle" className="t2 fill-slate-600 dark:fill-slate-300">{n.sub}</text>}
          {n.sub2 && <text x={cx} y={top + 35} textAnchor="middle" className="t3 fill-slate-500 dark:fill-slate-400">{n.sub2}</text>}
        </>
      )}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ Edges */
function EdgeShape({ e, active, dimmed, selected, rushPlaying, speed, onSelect }: {
  e: DiagramEdge; active: boolean; dimmed: boolean; selected: boolean; rushPlaying: boolean; speed: number;
  onSelect: (id: string, concept: string) => void;
}) {
  const tone = TONE[e.tone];
  const labelW = e.label ? e.label.length * 6.6 + 18 : 0;
  const hidden = e.pulse === "rush" && !active;
  return (
    <motion.g
      role="button" tabIndex={0} aria-label={`Connection ${e.label ?? e.id}: open details`}
      className="cursor-pointer outline-none"
      onClick={(ev) => { ev.stopPropagation(); onSelect(e.id, e.concept); }}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onSelect(e.id, e.concept); } }}
      animate={hidden ? (rushPlaying ? { opacity: [0.1, 0.1, 0.9, 0.9, 0.1] } : { opacity: 0.1 }) : { opacity: dimmed ? 0.35 : 1 }}
      transition={hidden && rushPlaying ? { duration: 7 / speed, repeat: Infinity, times: [0, 0.3, 0.42, 0.78, 0.9] } : { duration: 0.35 }}
    >
      <path d={e.d} fill="none" stroke="transparent" strokeWidth={20} />
      <path d={e.d} fill="none" className="stroke-slate-400/40 dark:stroke-slate-500/40" strokeWidth={2} strokeDasharray={e.dashed ? "5 5" : undefined} markerEnd={e.arrow ? "url(#arrow-muted)" : undefined} />
      {(active || selected) && (
        <motion.path d={e.d} fill="none" className={tone.stroke} strokeWidth={selected ? 3.5 : 2.5} strokeLinecap="round"
          strokeDasharray={e.dashed ? "5 5" : undefined} markerEnd={e.arrow ? `url(#arrow-${e.tone})` : undefined}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} />
      )}
      {e.label && e.labelAt && (
        <g>
          <rect x={e.labelAt[0] - labelW / 2} y={e.labelAt[1] - 12} width={labelW} height={24} rx={12}
            className={`fill-white dark:fill-slate-900 ${tone.stroke}`} strokeWidth={selected ? 2 : 1} />
          <text x={e.labelAt[0]} y={e.labelAt[1] + 4} textAnchor="middle" className={`t3 ${tone.label}`}>{e.label}</text>
        </g>
      )}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ Diagram + zoom */
export function Diagram({ era, stepIndex, playing, speed, selectedId, onSelect }: DiagramProps) {
  const step = era.steps[stepIndex];
  const focus = new Set(step?.focus ?? []);
  const hasFocus = focus.size > 0;
  const activeEdges = step?.edges ?? [];
  const cycle = Math.max(activeEdges.length * 0.9 + 0.9, 2.2);

  /* Zoom state: z = zoom level, (cx, cy) = centre of the view in diagram units. */
  const [z, setZ] = useState(1);
  const [c, setC] = useState({ x: W / 2, y: H / 2 });
  const clampCenter = useCallback((x: number, y: number, zz: number) => {
    const hw = W / (2 * zz), hh = H / (2 * zz);
    return { x: Math.min(Math.max(x, hw), W - hw), y: Math.min(Math.max(y, hh), H - hh) };
  }, []);
  const zoomTo = useCallback((nz: number) => {
    const zz = Math.min(Math.max(nz, 1), 3);
    setZ(zz); setC((cc) => clampCenter(cc.x, cc.y, zz));
  }, [clampCenter]);
  const fit = () => { setZ(1); setC({ x: W / 2, y: H / 2 }); };
  useEffect(fit, [era.id]);

  const vw = W / z, vh = H / z;
  const pad = 12;
  const viewBox = z === 1 ? `${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}` : `${c.x - vw / 2} ${c.y - vh / 2} ${vw} ${vh}`;

  /* Drag to pan when zoomed in. */
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (z === 1) return;
    drag.current = { x: e.clientX, y: e.clientY, cx: c.x, cy: c.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current, svg = svgRef.current;
    if (!d || !svg) return;
    const scale = vw / svg.clientWidth;
    const dx = (e.clientX - d.x) * scale, dy = (e.clientY - d.y) * scale;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setC(clampCenter(d.cx - dx, d.cy - dy, z));
  };
  const endDrag = () => { setTimeout(() => (drag.current = null), 0); };
  const onWheel = (e: React.WheelEvent) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    zoomTo(z * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  };

  const select = (id: string, concept: string) => { if (drag.current?.moved) return; onSelect(id, concept); };
  const isDim = (id: string) => hasFocus && !focus.has(id);

  return (
    <div className="relative" onClick={(e) => { if ((e.target as HTMLElement).closest("button")) e.stopPropagation(); }}>
      {/* Toolbar sits ABOVE the diagram so it can never cover any node or label */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[12px] text-slate-500 dark:text-slate-400">👆 Click any box, badge or arrow for full details{z > 1 ? " · drag to pan" : ""}</p>
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200 dark:bg-slate-800/80 dark:ring-slate-700">
          <button onClick={() => zoomTo(z / 1.25)} disabled={z <= 1} aria-label="Zoom out" className="h-8 w-8 rounded-lg text-lg font-bold hover:bg-white disabled:opacity-30 dark:hover:bg-slate-700">−</button>
          <span className="w-12 text-center font-mono text-xs text-slate-500 dark:text-slate-400" aria-live="polite">{Math.round(z * 100)}%</span>
          <button onClick={() => zoomTo(z * 1.25)} disabled={z >= 3} aria-label="Zoom in" className="h-8 w-8 rounded-lg text-lg font-bold hover:bg-white disabled:opacity-30 dark:hover:bg-slate-700">+</button>
          <button onClick={fit} aria-label="Fit diagram to screen" className="h-8 rounded-lg px-2.5 text-xs font-semibold hover:bg-white dark:hover:bg-slate-700">⤢ Fit</button>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        role="img"
        aria-label={`${era.title}: animated diagram. Click any box or arrow for details.`}
        className={`block h-auto w-full select-none ${z > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ touchAction: z > 1 ? "none" : "auto" }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}
        onWheel={onWheel}
      >
        <defs>
          <marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-slate-400/70" />
          </marker>
          {(Object.keys(TONE) as Tone[]).map((t) => (
            <marker key={t} id={`arrow-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={TONE[t].hex} />
            </marker>
          ))}
        </defs>

        <AnimatePresence mode="wait">
          <motion.g key={era.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            {/* zones first, then edges, then nodes, so lines never cover text */}
            {era.nodes.filter((n) => n.kind === "zone").map((n) => (
              <NodeShape key={n.id} n={n} dim={isDim(n.id)} focused={focus.has(n.id)} selected={selectedId === n.id} playing={playing} speed={speed} onSelect={select} />
            ))}
            {era.edges.map((e) => (
              <EdgeShape key={e.id} e={e} active={activeEdges.includes(e.id)} dimmed={hasFocus && !activeEdges.includes(e.id)}
                selected={selectedId === e.id} rushPlaying={playing} speed={speed} onSelect={select} />
            ))}
            {era.nodes.filter((n) => n.kind !== "zone").map((n, i) => (
              <motion.g key={n.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.05 + i * 0.035 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <NodeShape n={n} dim={isDim(n.id)} focused={focus.has(n.id)} selected={selectedId === n.id} playing={playing} speed={speed} onSelect={select} />
              </motion.g>
            ))}
            {activeEdges.map((id, i) => {
              const e = era.edges.find((x) => x.id === id);
              return e ? <Packet key={`${era.id}-${stepIndex}-${id}`} d={e.d} tone={e.tone} delay={i * 0.9} cycle={cycle} playing={playing} speed={speed} /> : null;
            })}
          </motion.g>
        </AnimatePresence>

        <NodeShape n={CUSTOMER} dim={isDim("customer")} focused={focus.has("customer")} selected={selectedId === "customer"} playing={playing} speed={speed} onSelect={select} />
      </svg>
    </div>
  );
}
