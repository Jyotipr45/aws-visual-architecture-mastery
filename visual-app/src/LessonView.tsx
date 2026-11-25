import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Lesson, Table } from "./lessonTypes";
import { Widget } from "./widgets";

const REPO = "https://github.com/Jyotipr45/aws-visual-architecture-mastery";
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring" as const, stiffness: 220, damping: 26 } };

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{children}</h2>;
}

function DataTable({ t }: { t: Table }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-left text-[13.5px]">
        <thead><tr>{t.head.map((h) => <th key={h} className="py-1.5 pr-3 text-xs uppercase text-slate-500">{h}</th>)}</tr></thead>
        <tbody>{t.rows.map((r, i) => <tr key={i} className="border-t border-slate-200 dark:border-slate-800">{r.map((c, k) => <td key={k} className={`py-1.5 pr-3 align-top ${k === 0 ? "font-semibold" : ""}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };
  return (
    <div className="relative">
      <button onClick={copy} className="absolute right-2 top-2 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-white/20">{copied ? "✓ Copied" : "Copy"}</button>
      <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 pr-20 font-mono text-[12.5px] leading-relaxed text-slate-100"><code>{code}</code></pre>
    </div>
  );
}

export function LessonView({ lesson: L, eraName, onOpenTimeline, prev, next, onGo }: {
  lesson: Lesson;
  eraName: string;
  onOpenTimeline: () => void;
  prev?: Lesson;
  next?: Lesson;
  onGo: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState<boolean[]>(() => L.cleanup.map(() => false));
  const glossary = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? L.glossary.filter((g) => Object.values(g).some((v) => v.toLowerCase().includes(q))) : L.glossary;
  }, [query, L.glossary]);

  return (
    <article className="mx-auto max-w-5xl space-y-12 pb-16">
      <motion.header {...fadeUp} className="space-y-4">
        <div className="text-sm font-semibold text-sky-600 dark:text-sky-400">Module {L.module} · Lesson {L.id}</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{L.title}</h1>
        <div className="flex flex-wrap gap-2">{L.meta.map((m) => <span key={m} className="rounded-full bg-slate-500/10 px-3 py-1 text-sm">{m}</span>)}</div>
        <p className="rounded-2xl bg-sky-500/10 p-4 text-[15.5px] leading-relaxed ring-1 ring-sky-500/25"><b>The one idea of this lesson:</b> {L.bigIdea}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onOpenTimeline} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-600">🎬 Watch “{eraName}” in the animated timeline</button>
          <a href={`${REPO}/blob/main/00-history-and-cloud-evolution/${L.file}`} target="_blank" rel="noreferrer" className="rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800">📄 Read as Markdown on GitHub</a>
        </div>
      </motion.header>

      <section>
        <H2>1. {L.storyHeading}</H2>
        <p className="mb-5 text-[15px] text-slate-700 dark:text-slate-300">{L.storyIntro}</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {L.storySteps.map((s, i) => (
            <motion.li key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 22, delay: i * 0.07 }}
              className={`card p-4 ${s.slow ? "ring-rose-400/60 dark:ring-rose-500/50" : ""}`}>
              <div className="mb-1 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-slate-500/15 text-xs font-bold">{i + 1}</span><span className="text-xl">{s.icon}</span></div>
              <div className="font-bold">{s.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{s.text}</div>
            </motion.li>
          ))}
        </ol>
        <div className="mt-5 space-y-3">{L.storyOutro.map((p, i) => <p key={i} className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{p}</p>)}</div>
      </section>

      <section>
        <H2>2. Every word, explained</H2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`🔎 ${L.glossaryHint}…`} aria-label="Filter glossary"
          className="mb-4 w-full rounded-xl bg-white px-4 py-2.5 text-sm ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-900 dark:ring-slate-700" />
        <div className="grid gap-3 md:grid-cols-2">
          <AnimatePresence>
            {glossary.map((g) => (
              <motion.div key={g.word} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="card space-y-1.5 p-4">
                <div className="flex flex-wrap items-baseline gap-2"><b className="text-lg">{g.word}</b><span className="font-mono text-xs text-sky-700 dark:text-sky-300">aka {g.alias}</span></div>
                <p className="text-[14px] text-slate-700 dark:text-slate-300">{g.meaning}</p>
                <p className="text-[13.5px] text-emerald-800 dark:text-emerald-300">🍔 {g.foodDash}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {glossary.length === 0 && <p className="text-sm text-slate-500">No term matches “{query}”.</p>}
      </section>

      <section>
        <H2>3. {L.ideasHeading}</H2>
        <div className={`grid gap-3 ${L.ideas.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {L.ideas.map((p) => (
            <motion.div key={p.title} {...fadeUp} className="card p-4">
              <div className="text-2xl">{p.icon}</div>
              <div className="mb-1 font-bold">{p.title}</div>
              <p className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">{p.text}</p>
              {p.table && <DataTable t={p.table} />}
            </motion.div>
          ))}
        </div>
        {L.widget && <div className="mt-5"><Widget id={L.widget} /></div>}
      </section>

      <section>
        <H2>4. 🧪 {L.labHeading}</H2>
        <dl className="mb-5 grid gap-2 text-[14.5px] sm:grid-cols-3">
          <div className="card p-3"><dt className="text-xs font-bold uppercase text-slate-500">Goal</dt><dd>{L.lab.goal}</dd></div>
          <div className="card p-3"><dt className="text-xs font-bold uppercase text-slate-500">Cost</dt><dd>{L.lab.cost}</dd></div>
          <div className="card p-3"><dt className="text-xs font-bold uppercase text-slate-500">Where</dt><dd>{L.lab.where}</dd></div>
        </dl>
        {L.lab.before && (
          <ul className="card mb-5 space-y-1.5 p-4 text-[14.5px]">
            {L.lab.before.map((b) => <li key={b}>☑️ {b}</li>)}
          </ul>
        )}
        <div className="space-y-6">
          {L.lab.steps.map((s) => (
            <div key={s.title} className="space-y-2">
              <h3 className="font-bold">{s.title}</h3>
              <CopyBlock code={s.code} />
              {s.output && (<><div className="text-xs font-bold uppercase text-slate-500">Expected output</div><pre className="overflow-x-auto rounded-xl bg-emerald-950 p-4 font-mono text-[12.5px] text-emerald-100">{s.output}</pre></>)}
              <p className="text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">{s.after}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>5. 🤔 What happens if...?</H2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Think about your answer first, then click to reveal it.</p>
        <div className="space-y-3">
          {L.whatIfs.map((w, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold">
                <span>{i + 1}. {w.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-xl text-sky-500">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
                    <p className="border-t border-slate-200 p-4 text-[14.5px] leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300">{w.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section>
        <H2>6. 🧹 Cleanup (mandatory habit)</H2>
        <ul className="card space-y-2 p-4">
          {L.cleanup.map((c, i) => (
            <li key={i}>
              <label className="flex cursor-pointer gap-3 text-[14.5px]">
                <input type="checkbox" checked={done[i]} onChange={() => setDone(done.map((d, k) => (k === i ? !d : d)))} className="mt-1 h-4 w-4 accent-emerald-500" />
                <span className={done[i] ? "text-slate-400 line-through" : ""}>{c}</span>
              </label>
            </li>
          ))}
          <AnimatePresence>{done.every(Boolean) && <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-bold text-emerald-600 dark:text-emerald-400">{L.cleanupDone}</motion.li>}</AnimatePresence>
        </ul>
      </section>

      <section>
        <H2>7. Key takeaways</H2>
        <ul className="space-y-2">{L.takeaways.map((t) => <li key={t} className="card p-3 text-[14.5px]">✔️ {t}</li>)}</ul>
        <nav className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <button onClick={() => onGo(prev.id)} className="card p-4 text-left hover:ring-sky-500/60">
              <div className="text-xs text-slate-500">⬅️ Previous</div><div className="font-bold">Lesson {prev.id}: {prev.shortTitle}</div>
            </button>
          ) : <span />}
          {next ? (
            <button onClick={() => onGo(next.id)} className="card p-4 text-right hover:ring-sky-500/60">
              <div className="text-xs text-slate-500">Next ➡️</div><div className="font-bold">Lesson {next.id}: {next.shortTitle}</div>
            </button>
          ) : <div className="card p-4 text-right text-sm text-slate-500">➡️ Next: {L.next} (coming next)</div>}
        </nav>
      </section>
    </article>
  );
}
