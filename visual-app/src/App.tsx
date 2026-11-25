import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONCEPTS } from "./concepts";
import { DetailPanel } from "./DetailPanel";
import { Diagram } from "./Diagram";
import { ERAS } from "./eras";
import { LessonView } from "./LessonView";
import { ThemeSwitcher, useTheme } from "./theme";
import { TONE } from "./tones";

type View = "timeline" | "lesson";
const STEP_MS = 7000;

function useIsDesktop() {
  const q = "(min-width: 1024px)";
  const [d, setD] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setD(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

export default function App() {
  const [mode, setMode] = useTheme();
  const isDesktop = useIsDesktop();
  const [view, setView] = useState<View>(() => (location.hash === "#lesson-0.1" ? "lesson" : "timeline"));
  const [eraIdx, setEraIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [autoTour, setAutoTour] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<{ id: string; concept: string } | null>(null);
  const [tourElapsed, setTourElapsed] = useState(0);
  const tourRef = useRef(0);

  const era = ERAS[eraIdx];
  const step = era.steps[stepIdx];

  useEffect(() => { history.replaceState(null, "", view === "lesson" ? "#lesson-0.1" : "#timeline"); }, [view]);

  const goEra = useCallback((i: number, openDetails = false) => {
    const n = (i + ERAS.length) % ERAS.length;
    setEraIdx(n); setStepIdx(0); tourRef.current = 0; setTourElapsed(0);
    setSelected(openDetails ? { id: ERAS[n].id, concept: ERAS[n].concept } : null);
  }, []);
  const goStep = useCallback((delta: number) => {
    tourRef.current = 0; setTourElapsed(0);
    const next = stepIdx + delta;
    if (next >= era.steps.length) { goEra(eraIdx + 1); return; }
    if (next < 0) {
      if (eraIdx === 0) { setStepIdx(0); return; }
      setEraIdx(eraIdx - 1); setStepIdx(ERAS[eraIdx - 1].steps.length - 1); setSelected(null);
      return;
    }
    setStepIdx(next);
  }, [stepIdx, era.steps.length, eraIdx, goEra]);
  const goStepRef = useRef(goStep);
  goStepRef.current = goStep;

  /* Auto tour: advances the walkthrough while playing. */
  useEffect(() => {
    if (!autoTour || !playing || view !== "timeline") return;
    let last = performance.now(), raf = 0;
    const tick = (now: number) => {
      tourRef.current += (now - last) * speed; last = now;
      if (tourRef.current >= STEP_MS) { tourRef.current = 0; goStepRef.current(1); }
      setTourElapsed(tourRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoTour, playing, speed, view]);

  /* Keyboard: ←/→ steps, Shift+←/→ eras, Space play/pause. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (view !== "timeline" || (e.target as HTMLElement).closest("input,select,textarea,[role=button],button")) return;
      if (e.key === "ArrowRight") e.shiftKey ? goEra(eraIdx + 1, true) : goStep(1);
      else if (e.key === "ArrowLeft") e.shiftKey ? goEra(eraIdx - 1, true) : goStep(-1);
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, eraIdx, goEra, goStep]);

  const tone = TONE[era.tone];
  const panelConcept = selected?.concept ?? era.concept;

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:py-7">
      {/* ---------------- Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">AWS Visual Architecture Mastery</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {view === "timeline" ? <>How we got to the cloud: <span style={{ color: tone.hex }}>{era.name}</span></> : "Lesson 0.1"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Sections" className="relative flex rounded-xl bg-slate-200/70 p-1 ring-1 ring-slate-300/60 dark:bg-slate-800/70 dark:ring-slate-700">
            {([["timeline", "🎬 Timeline"], ["lesson", "📖 Lesson 0.1"]] as [View, string][]).map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} aria-current={view === v ? "page" : undefined}
                className="relative z-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-200">
                {view === v && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm dark:bg-slate-950" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                {label}
              </button>
            ))}
          </nav>
          <ThemeSwitcher mode={mode} setMode={setMode} />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "lesson" ? (
          <motion.main key="lesson" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <LessonView onOpenTimeline={() => { setView("timeline"); goEra(0, true); }} />
          </motion.main>
        ) : (
          <motion.main key="timeline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-5">
            {/* ---------------- Era bar */}
            <nav aria-label="Eras" className="card relative grid grid-cols-5 gap-1 p-2">
              {ERAS.map((e, i) => {
                const on = i === eraIdx;
                return (
                  <button key={e.id} onClick={() => goEra(i, true)} aria-current={on ? "step" : undefined} aria-label={`Era ${i + 1}: ${e.name}. Open details.`}
                    className="relative z-0 flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-center outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                    {on && <motion.span layoutId="era-pill" className="absolute inset-0 -z-10 rounded-xl bg-slate-900/[0.06] ring-1 dark:bg-white/[0.06]" style={{ ["--tw-ring-color" as string]: TONE[e.tone].hex }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <motion.span animate={{ scale: on ? 1.18 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="text-xl sm:text-2xl" aria-hidden>{e.icon}</motion.span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 sm:text-[11px]">{e.year}</span>
                    <span className={`text-[11px] font-semibold sm:text-sm ${on ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{e.name}</span>
                    <span className="mt-0.5 h-1 w-full max-w-[90px] overflow-hidden rounded-full bg-slate-500/15">
                      <motion.span className="block h-full rounded-full" style={{ background: TONE[e.tone].hex }}
                        animate={{ width: i < eraIdx ? "100%" : on ? `${((stepIdx + 1) / e.steps.length) * 100}%` : "0%" }} transition={{ type: "spring", stiffness: 200, damping: 26 }} />
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* ---------------- Controls */}
            <div className="card flex flex-wrap items-center gap-2 p-3">
              <button onClick={() => goStep(-1)} className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800" aria-label="Previous step">◀ Step</button>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setPlaying((p) => !p)} className="min-w-[108px] rounded-xl px-4 py-2 text-sm font-bold text-white shadow" style={{ background: tone.hex }} aria-label={playing ? "Pause animation" : "Play animation"}>
                {playing ? "⏸ Pause" : "▶ Play"}
              </motion.button>
              <button onClick={() => goStep(1)} className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800" aria-label="Next step">Step ▶</button>
              <label className="ml-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">🐢 Speed
                <select value={speed} onChange={(e) => setSpeed(+e.target.value)} className="rounded-lg bg-white px-2 py-1.5 text-sm ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700">
                  {[0.5, 1, 1.5, 2].map((s) => <option key={s} value={s}>{s}x</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={autoTour} onChange={(e) => { setAutoTour(e.target.checked); tourRef.current = 0; setTourElapsed(0); }} className="h-4 w-4 accent-sky-500" /> Auto-tour
              </label>
              {autoTour && <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-500/20"><span className="block h-full rounded-full" style={{ width: `${(tourElapsed / STEP_MS) * 100}%`, background: tone.hex }} /></span>}
              <span className="ml-auto font-mono text-xs text-slate-500 dark:text-slate-400">Era {eraIdx + 1}/5 · Step {stepIdx + 1}/{era.steps.length}</span>
            </div>

            {/* ---------------- Main grid */}
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
              <div className="flex min-w-0 flex-col gap-5">
                <section className="card p-2 sm:p-3" onClick={() => setSelected(null)}>
                  <Diagram era={era} stepIndex={stepIdx} playing={playing} speed={speed} selectedId={selected?.id ?? null}
                    onSelect={(id, concept) => setSelected({ id, concept })} />
                </section>

                {/* Walkthrough */}
                <section className="card p-5" aria-live="polite">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tone.hex }}>Walkthrough · step {stepIdx + 1} of {era.steps.length}</span>
                    <div className="flex gap-1.5" role="tablist" aria-label="Steps">
                      {era.steps.map((s, i) => (
                        <button key={i} role="tab" aria-selected={i === stepIdx} aria-label={`Step ${i + 1}: ${s.title}`} onClick={() => { setStepIdx(i); tourRef.current = 0; setTourElapsed(0); }}
                          className="h-2.5 rounded-full transition-all" style={{ width: i === stepIdx ? 28 : 10, background: i <= stepIdx ? tone.hex : "rgb(148 163 184 / 0.35)" }} />
                      ))}
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={`${era.id}-${stepIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                      <h2 className="mb-1.5 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h2>
                      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{step.text}</p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.focus.filter((f) => f !== "customer").map((id) => {
                      const n = era.nodes.find((x) => x.id === id);
                      return n ? <button key={id} onClick={() => setSelected({ id, concept: n.concept })} className="rounded-lg bg-slate-500/10 px-2.5 py-1 text-xs font-semibold hover:bg-slate-500/20">🔍 {CONCEPTS[n.concept]?.name ?? n.title}</button> : null;
                    })}
                    {step.edges.map((id) => {
                      const e = era.edges.find((x) => x.id === id);
                      return e ? <button key={id} onClick={() => setSelected({ id, concept: e.concept })} className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-500/20 dark:text-sky-300">🔌 {CONCEPTS[e.concept]?.name}</button> : null;
                    })}
                    <button onClick={() => setSelected({ id: era.id, concept: era.concept })} className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-500/20 dark:text-amber-200">📜 About this era</button>
                  </div>
                </section>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {era.stats.map(([k, v], i) => (
                    <motion.div key={`${era.id}-${k}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.05 }} className="card p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{k}</div>
                      <div className="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">{v}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {isDesktop && <DetailPanel conceptKey={panelConcept} onClose={() => setSelected(null)} asSheet={false} showReset={!!selected && selected.id !== era.id} />}
            </div>
            {!isDesktop && <DetailPanel conceptKey={selected?.concept ?? null} onClose={() => setSelected(null)} asSheet />}
          </motion.main>
        )}
      </AnimatePresence>

      <footer className="pb-4 pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Keyboard: ← → steps · Shift + ← → eras · Space play/pause · Esc closes details ·{" "}
        <a className="text-sky-600 hover:underline dark:text-sky-400" href="https://github.com/Jyotipr45/aws-visual-architecture-mastery" target="_blank" rel="noreferrer">GitHub repo</a>
        {" "}· by Jyoti Prakash Parida · MIT License
      </footer>
    </div>
  );
}
