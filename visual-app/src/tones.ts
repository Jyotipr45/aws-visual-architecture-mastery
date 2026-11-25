import type { Tone } from "./types";

/**
 * Tailwind class sets per colour family. Written out in full (not built from strings)
 * so Tailwind can see and generate every class. Each works in light and dark themes.
 */
export const TONE: Record<Tone, {
  stroke: string; fill: string; zoneFill: string; label: string; dot: string;
  chip: string; solid: string; ring: string; hex: string;
}> = {
  slate: {
    stroke: "stroke-slate-400 dark:stroke-slate-500", fill: "fill-slate-500/10 dark:fill-slate-400/10",
    zoneFill: "fill-slate-500/[0.04]", label: "fill-slate-600 dark:fill-slate-300", dot: "fill-slate-500 dark:fill-slate-300",
    chip: "bg-slate-500/10 text-slate-700 ring-slate-500/30 dark:text-slate-300", solid: "bg-slate-500", ring: "ring-slate-400", hex: "#94a3b8",
  },
  sky: {
    stroke: "stroke-sky-500 dark:stroke-sky-400", fill: "fill-sky-500/10", zoneFill: "fill-sky-500/[0.04]",
    label: "fill-sky-700 dark:fill-sky-300", dot: "fill-sky-500 dark:fill-sky-400",
    chip: "bg-sky-500/10 text-sky-700 ring-sky-500/30 dark:text-sky-300", solid: "bg-sky-500", ring: "ring-sky-400", hex: "#0ea5e9",
  },
  violet: {
    stroke: "stroke-violet-500 dark:stroke-violet-400", fill: "fill-violet-500/10", zoneFill: "fill-violet-500/[0.04]",
    label: "fill-violet-700 dark:fill-violet-300", dot: "fill-violet-500 dark:fill-violet-400",
    chip: "bg-violet-500/10 text-violet-700 ring-violet-500/30 dark:text-violet-300", solid: "bg-violet-500", ring: "ring-violet-400", hex: "#8b5cf6",
  },
  emerald: {
    stroke: "stroke-emerald-500 dark:stroke-emerald-400", fill: "fill-emerald-500/10", zoneFill: "fill-emerald-500/[0.04]",
    label: "fill-emerald-700 dark:fill-emerald-300", dot: "fill-emerald-500 dark:fill-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300", solid: "bg-emerald-500", ring: "ring-emerald-400", hex: "#10b981",
  },
  amber: {
    stroke: "stroke-amber-500 dark:stroke-amber-400", fill: "fill-amber-500/10", zoneFill: "fill-amber-500/[0.04]",
    label: "fill-amber-700 dark:fill-amber-300", dot: "fill-amber-500 dark:fill-amber-400",
    chip: "bg-amber-500/10 text-amber-700 ring-amber-500/30 dark:text-amber-300", solid: "bg-amber-500", ring: "ring-amber-400", hex: "#f59e0b",
  },
  rose: {
    stroke: "stroke-rose-500 dark:stroke-rose-400", fill: "fill-rose-500/10", zoneFill: "fill-rose-500/[0.04]",
    label: "fill-rose-700 dark:fill-rose-300", dot: "fill-rose-500 dark:fill-rose-400",
    chip: "bg-rose-500/10 text-rose-700 ring-rose-500/30 dark:text-rose-300", solid: "bg-rose-500", ring: "ring-rose-400", hex: "#f43f5e",
  },
};
