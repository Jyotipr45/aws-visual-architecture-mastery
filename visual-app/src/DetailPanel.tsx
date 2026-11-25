import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CONCEPTS } from "./concepts";
import type { ConnectionRule } from "./types";

const DIR: Record<ConnectionRule["direction"], { icon: string; label: string }> = {
  in: { icon: "←", label: "comes in" },
  out: { icon: "→", label: "goes out" },
  both: { icon: "↔", label: "two-way" },
};

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span aria-hidden>{icon}</span>{title}
      </h4>
      {children}
    </section>
  );
}

/** Full explanation for one concept. Every field is shown; nothing is truncated. */
export function ConceptBody({ conceptKey }: { conceptKey: string }) {
  const c = CONCEPTS[conceptKey];
  if (!c) return <p className="text-sm text-slate-500">No details found for “{conceptKey}”.</p>;
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h3 className="text-xl font-extrabold leading-tight text-slate-900 dark:text-white">{c.name}</h3>
        <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300">{c.oneLiner}</p>
        <div className="flex flex-wrap gap-1.5" aria-label="Also known as">
          {c.aliases.map((a) => (
            <span key={a} className="rounded-md bg-sky-500/10 px-2 py-0.5 font-mono text-[11.5px] text-sky-700 ring-1 ring-sky-500/25 dark:text-sky-300">aka {a}</span>
          ))}
        </div>
      </header>

      <Section icon="🗣️" title="In plain English">
        {c.plain.map((p, i) => <p key={i} className="text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">{p}</p>)}
      </Section>

      <Section icon="🏠" title="Real-world analogy">
        <p className="rounded-xl bg-amber-500/10 p-3 text-[14.5px] leading-relaxed text-amber-900 ring-1 ring-amber-500/25 dark:text-amber-100">{c.analogy}</p>
      </Section>

      <Section icon="🎯" title="Why it exists">
        <p className="text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">{c.why}</p>
      </Section>

      <Section icon="🍔" title="Its job in FoodDash">
        <p className="rounded-xl bg-emerald-500/10 p-3 text-[14.5px] leading-relaxed text-emerald-900 ring-1 ring-emerald-500/25 dark:text-emerald-100">{c.foodDash}</p>
      </Section>

      {c.connections.length > 0 && (
        <Section icon="🔌" title="How it connects (exact rules)">
          <ul className="space-y-2.5">
            {c.connections.map((r, i) => (
              <li key={i} className="rounded-xl bg-slate-500/[0.06] p-3 ring-1 ring-slate-500/15">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-white dark:bg-slate-200 dark:text-slate-900" title={DIR[r.direction].label}>{DIR[r.direction].icon}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{r.peer}</span>
                </div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-violet-500/10 px-2 py-0.5 font-mono text-[11.5px] text-violet-700 ring-1 ring-violet-500/25 dark:text-violet-300">protocol: {r.protocol}</span>
                  <span className="rounded-md bg-rose-500/10 px-2 py-0.5 font-mono text-[11.5px] text-rose-700 ring-1 ring-rose-500/25 dark:text-rose-300">port: {r.port}</span>
                  <span className="rounded-md bg-slate-500/10 px-2 py-0.5 font-mono text-[11.5px] text-slate-600 ring-1 ring-slate-500/25 dark:text-slate-300">{DIR[r.direction].label}</span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300">{r.rule}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {c.advanced.length > 0 && (
        <Section icon="🚀" title="Going deeper (advanced)">
          <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-slate-700 marker:text-slate-400 dark:text-slate-300">
            {c.advanced.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </Section>
      )}

      {c.facts.length > 0 && (
        <Section icon="📐" title="Exact details: ports, ARNs, numbers">
          <ul className="space-y-1.5">
            {c.facts.map((f, i) => (
              <li key={i} className="break-words rounded-lg bg-slate-900 px-3 py-2 font-mono text-[12.5px] leading-relaxed text-slate-100 dark:bg-black/50">{f}</li>
            ))}
          </ul>
        </Section>
      )}

      {c.mistakes && c.mistakes.length > 0 && (
        <Section icon="⚠️" title="Common beginner mistakes">
          <ul className="space-y-1.5">
            {c.mistakes.map((m, i) => (
              <li key={i} className="rounded-lg bg-rose-500/10 px-3 py-2 text-[13.5px] text-rose-900 ring-1 ring-rose-500/25 dark:text-rose-100">{m}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/** Side panel on large screens; slide-up sheet on small screens. */
export function DetailPanel({ conceptKey, onClose, asSheet, showReset = false }: { conceptKey: string | null; onClose: () => void; asSheet: boolean; showReset?: boolean }) {
  useEffect(() => {
    if (!conceptKey) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [conceptKey, onClose]);

  if (asSheet) {
    return (
      <AnimatePresence>
        {conceptKey && (
          <motion.div className="fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close details" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
            <motion.aside
              role="dialog" aria-modal="true" aria-label="Details"
              className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-10 shadow-2xl dark:bg-slate-900"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
              <button onClick={onClose} className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">✕ Close</button>
              <ConceptBody conceptKey={conceptKey} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside aria-live="polite" className="card sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">🔍 Detail inspector</span>
        {showReset && <button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Show era ↺</button>}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={conceptKey ?? "none"} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
          {conceptKey ? <ConceptBody conceptKey={conceptKey} /> : <p className="text-sm text-slate-500">Click any box, arrow or era to see everything about it.</p>}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
