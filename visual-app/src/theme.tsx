import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const readSaved = (): ThemeMode => {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  } catch {
    return "system";
  }
};

/** Light / Dark / System theme. "System" follows prefers-color-scheme and updates live. */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(readSaved);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    try { localStorage.setItem("theme", mode); } catch { /* storage may be blocked */ }
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);
  return [mode, setMode] as const;
}

const OPTIONS: { id: ThemeMode; icon: string; label: string }[] = [
  { id: "light", icon: "☀️", label: "Light" },
  { id: "dark", icon: "🌙", label: "Dark" },
  { id: "system", icon: "🖥️", label: "System" },
];

export function ThemeSwitcher({ mode, setMode }: { mode: ThemeMode; setMode: (m: ThemeMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Colour theme" className="relative flex rounded-xl bg-slate-200/70 p-1 ring-1 ring-slate-300/60 dark:bg-slate-800/70 dark:ring-slate-700">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={mode === o.id}
          onClick={() => setMode(o.id)}
          className="relative z-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-300 sm:px-3"
        >
          {mode === o.id && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm dark:bg-slate-950"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span aria-hidden>{o.icon}</span>
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
