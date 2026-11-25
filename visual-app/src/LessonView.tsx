import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LESSON01 as L } from "./lesson01";

const REPO = "https://github.com/Jyotipr45/aws-visual-architecture-mastery";
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring" as const, stiffness: 220, damping: 26 } };

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{children}</h2>;
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

function Slider({ label, value, set, min, max, stepV }: { label: string; value: number; set: (n: number) => void; min: number; max: number; stepV: number }) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-300">{label}</span><b className="font-mono">{value.toLocaleString("en-IN")}</b></span>
      <input type="range" min={min} max={max} step={stepV} value={value} onChange={(e) => set(+e.target.value)} className="mt-1 w-full accent-sky-500" />
    </label>
  );
}

/** Interactive version of the capacity-planning math from the lab. */
function CapacityCalculator() {
  const [normal, setNormal] = useState(100);
  const [peak, setPeak] = useState(1000);
  const [perServer, setPerServer] = useState(100);
  const servers = Math.max(1, Math.ceil(peak / perServer));
  const util = Math.min(100, Math.round((normal / (servers * perServer)) * 100));
  return (
    <div className="card grid gap-6 p-5 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="font-bold">🧮 Try it: FoodDash capacity planner</h3>
        <Slider label="Orders per minute, normal day" value={normal} set={setNormal} min={50} max={1000} stepV={50} />
        <Slider label="Orders per minute, Diwali peak" value={peak} set={setPeak} min={100} max={10000} stepV={100} />
        <Slider label="Orders one server can handle" value={perServer} set={setPerServer} min={50} max={500} stepV={50} />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-500/10 p-3"><div className="text-xs uppercase tracking-wide text-slate-500">Servers to buy</div><motion.div key={servers} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-3xl font-extrabold">{servers}</motion.div></div>
          <div className="rounded-xl bg-rose-500/10 p-3"><div className="text-xs uppercase tracking-wide text-slate-500">Idle on normal days</div><div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{100 - util}%</div></div>
        </div>
        <div>
          <div className="mb-1 text-sm text-slate-600 dark:text-slate-300">Average utilization: <b>{util}%</b></div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-500/15">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" animate={{ width: `${util}%` }} transition={{ type: "spring", stiffness: 200, damping: 24 }} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1" aria-label={`${servers} servers, ${Math.ceil(normal / perServer)} busy on a normal day`}>
          {Array.from({ length: Math.min(servers, 60) }).map((_, i) => (
            <motion.span key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.01 }}
              className={`grid h-6 w-6 place-items-center rounded text-[11px] ${i < Math.ceil(normal / perServer) ? "bg-emerald-500 text-white" : "bg-slate-400/30"}`}>🖥️</motion.span>
          ))}
          {servers > 60 && <span className="text-xs text-slate-500">+{servers - 60} more</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Green = busy on a normal day · grey = bought only for the peak, idle the rest of the year.</p>
      </div>
    </div>
  );
}

export function LessonView({ onOpenTimeline }: { onOpenTimeline: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState<boolean[]>(() => L.cleanup.map(() => false));
  const glossary = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? L.glossary.filter((g) => Object.values(g).some((v) => v.toLowerCase().includes(q))) : L.glossary;
  }, [query]);

  return (
    <article className="mx-auto max-w-5xl space-y-12 pb-16">
      <motion.header {...fadeUp} className="space-y-4">
        <div className="text-sm font-semibold text-sky-600 dark:text-sky-400">Module 00 · Lesson {L.id}</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{L.title}</h1>
        <div className="flex flex-wrap gap-2">{L.meta.map((m) => <span key={m} className="rounded-full bg-slate-500/10 px-3 py-1 text-sm">{m}</span>)}</div>
        <p className="rounded-2xl bg-sky-500/10 p-4 text-[15.5px] leading-relaxed ring-1 ring-sky-500/25"><b>The one idea of this lesson:</b> {L.bigIdea}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onOpenTimeline} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-600">🎬 Watch Era 1 in the animated timeline</button>
          <a href={`${REPO}/blob/main/00-history-and-cloud-evolution/lesson-0.1-bare-metal-servers.md`} target="_blank" rel="noreferrer" className="rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 hover:bg-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800">📄 Read as Markdown on GitHub</a>
        </div>
      </motion.header>

      <section>
        <H2>1. The story: launching FoodDash in 2003</H2>
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
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔎 Filter terms (e.g. CPU, CapEx, SPOF)…" aria-label="Filter glossary"
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
        <H2>3. The three big pains</H2>
        <div className="grid gap-3 md:grid-cols-3">
          {L.pains.map((p) => (
            <motion.div key={p.title} {...fadeUp} className="card p-4">
              <div className="text-2xl">{p.icon}</div>
              <div className="mb-1 font-bold">{p.title}</div>
              <p className="text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">{p.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-5"><CapacityCalculator /></div>
      </section>

      <section>
        <H2>4. 🧪 Hands-on lab: treat your laptop like a bare-metal server</H2>
        <dl className="mb-5 grid gap-2 text-[14.5px] sm:grid-cols-3">
          <div className="card p-3"><dt className="text-xs font-bold uppercase text-slate-500">Goal</dt><dd>{L.lab.goal}</dd></div>
          <div className="card p-3"><dt className="text-xs font-bold uppercase text-slate-500">Cost</dt><dd>{L.lab.cost}</dd></div>
          <div className="card p-3"><dt className="text-xs font-bold uppercase text-slate-500">Where</dt><dd>{L.lab.where}</dd></div>
        </dl>
        <div className="space-y-6">
          {L.lab.steps.map((s) => (
            <div key={s.title} className="space-y-2">
              <h3 className="font-bold">{s.title}</h3>
              <CopyBlock code={s.code} />
              {"output" in s && s.output && (<><div className="text-xs font-bold uppercase text-slate-500">Expected output</div><pre className="overflow-x-auto rounded-xl bg-emerald-950 p-4 font-mono text-[12.5px] text-emerald-100">{s.output}</pre></>)}
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
          <AnimatePresence>{done.every(Boolean) && <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-bold text-emerald-600 dark:text-emerald-400">✅ Done. Bill: $0.00.</motion.li>}</AnimatePresence>
        </ul>
      </section>

      <section>
        <H2>7. Key takeaways</H2>
        <ul className="space-y-2">{L.takeaways.map((t) => <li key={t} className="card p-3 text-[14.5px]">✔️ {t}</li>)}</ul>
        <p className="mt-6 text-sm text-slate-500">➡️ Next: Lesson 0.2: Virtualization and hypervisors (coming next).</p>
      </section>
    </article>
  );
}
