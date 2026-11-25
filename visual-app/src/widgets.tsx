/**
 * Interactive "try it" tools, one per lesson. Each one turns the lesson's key
 * idea into numbers you can drag around. All prices are real AWS on-demand list
 * prices checked in November 2026 (see each widget's footnote).
 */
import { motion } from "framer-motion";
import { useState } from "react";
import type { WidgetId } from "./lessonTypes";

const spring = { type: "spring" as const, stiffness: 200, damping: 24 };

export function Slider({ label, value, set, min, max, stepV, show }: { label: string; value: number; set: (n: number) => void; min: number; max: number; stepV: number; show?: string }) {
  return (
    <label className="block">
      <span className="flex justify-between gap-3 text-sm"><span className="text-slate-600 dark:text-slate-300">{label}</span><b className="shrink-0 font-mono">{show ?? value.toLocaleString("en-IN")}</b></span>
      <input type="range" min={min} max={max} step={stepV} value={value} onChange={(e) => set(+e.target.value)} className="mt-1 w-full accent-sky-500" />
    </label>
  );
}

function Stat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "rose" | "emerald" | "sky" }) {
  const bg = { slate: "bg-slate-500/10", rose: "bg-rose-500/10", emerald: "bg-emerald-500/10", sky: "bg-sky-500/10" }[tone];
  const fg = { slate: "", rose: "text-rose-600 dark:text-rose-400", emerald: "text-emerald-600 dark:text-emerald-400", sky: "text-sky-600 dark:text-sky-400" }[tone];
  return (
    <div className={`rounded-xl p-3 ${bg}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <motion.div key={value} initial={{ scale: 1.15, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className={`text-2xl font-extrabold sm:text-3xl ${fg}`}>{value}</motion.div>
    </div>
  );
}

function Bar({ pct, from = "from-emerald-500", to = "to-sky-500" }: { pct: number; from?: string; to?: string }) {
  return (
    <div className="h-4 overflow-hidden rounded-full bg-slate-500/15">
      <motion.div className={`h-full rounded-full bg-gradient-to-r ${from} ${to}`} animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }} transition={spring} />
    </div>
  );
}

const usd = (n: number) => (n < 0.005 ? "$0.00" : n < 100 ? `$${n.toFixed(2)}` : `$${Math.round(n).toLocaleString("en-US")}`);

/* ---------------- Lesson 0.1: capacity planning ---------------- */
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
          <Stat label="Servers to buy" value={String(servers)} />
          <Stat label="Idle on normal days" value={`${100 - util}%`} tone="rose" />
        </div>
        <div>
          <div className="mb-1 text-sm text-slate-600 dark:text-slate-300">Average utilization: <b>{util}%</b></div>
          <Bar pct={util} />
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

/* ---------------- Lesson 0.2: server consolidation ---------------- */
function ConsolidationSimulator() {
  const [apps, setApps] = useState(12);
  const [appCpu, setAppCpu] = useState(12);
  const [target, setTarget] = useState(70);
  const overhead = 10; // % of each host the hypervisor itself uses
  const usable = target - overhead;
  const hosts = Math.max(1, Math.ceil((apps * appCpu) / usable));
  const hostUtil = Math.min(100, Math.round((apps * appCpu) / hosts + overhead));
  const saved = Math.round((1 - hosts / apps) * 100);
  const perHost = Math.ceil(apps / hosts);
  return (
    <div className="card space-y-6 p-5">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-bold">🧩 Try it: squeeze FoodDash's apps onto fewer servers</h3>
          <Slider label="Apps (each one had its own bare-metal server)" value={apps} set={setApps} min={3} max={40} stepV={1} />
          <Slider label="CPU each app really uses" value={appCpu} set={setAppCpu} min={5} max={40} stepV={1} show={`${appCpu}%`} />
          <Slider label="Safe target CPU for one virtualized host" value={target} set={setTarget} min={40} max={85} stepV={5} show={`${target}%`} />
          <p className="text-xs text-slate-500 dark:text-slate-400">The hypervisor itself uses about {overhead}% of each host, so {usable}% is left for VMs.</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Before (servers)" value={String(apps)} tone="rose" />
            <Stat label="After (hosts)" value={String(hosts)} tone="emerald" />
            <Stat label="Hardware saved" value={`${Math.max(0, saved)}%`} tone="sky" />
          </div>
          <div>
            <div className="mb-1 text-sm text-slate-600 dark:text-slate-300">CPU used per server, before: <b>{appCpu}%</b></div>
            <Bar pct={appCpu} from="from-rose-500" to="to-rose-400" />
          </div>
          <div>
            <div className="mb-1 text-sm text-slate-600 dark:text-slate-300">CPU used per host, after: <b>{hostUtil}%</b></div>
            <Bar pct={hostUtil} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-bold uppercase text-slate-500">Bare-metal: one app per box</div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: apps }).map((_, i) => (
              <motion.div key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative h-10 w-8 overflow-hidden rounded bg-slate-400/25 ring-1 ring-slate-400/40" title={`Server ${i + 1}: ${appCpu}% busy`}>
                <motion.div className="absolute bottom-0 w-full bg-rose-500/70" animate={{ height: `${appCpu}%` }} transition={spring} />
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-bold uppercase text-slate-500">Virtualized: many VMs per host</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: hosts }).map((_, h) => {
              const vms = Math.min(perHost, apps - h * perHost);
              return (
                <motion.div key={h} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-lg bg-slate-500/10 p-1.5 ring-1 ring-sky-500/40">
                  <div className="mb-1 rounded bg-sky-500/20 px-1 text-center font-mono text-[9px] text-sky-700 dark:text-sky-300">hypervisor</div>
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: Math.max(0, vms) }).map((_, v) => (
                      <span key={v} className="grid h-5 w-5 place-items-center rounded bg-emerald-500 text-[9px] font-bold text-white">VM</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Lesson 0.3: elastic scaling over a day ---------------- */
// FoodDash orders per minute, hour 0..23, on a normal day (lunch and dinner rush).
const DAY = [20, 10, 6, 5, 5, 8, 20, 45, 70, 80, 95, 150, 260, 230, 140, 100, 110, 170, 260, 380, 420, 330, 180, 70];
const T3_MICRO_MUMBAI = 0.0112; // USD per hour, on-demand Linux, ap-south-1

function ElasticSimulator() {
  const [boost, setBoost] = useState(1);
  const [perServer, setPerServer] = useState(100);
  const load = DAY.map((d) => d * boost);
  const peak = Math.max(...load);
  const fixed = Math.ceil(peak / perServer);
  const elastic = load.map((l) => Math.max(1, Math.ceil(l / perServer)));
  const fixedHours = fixed * 24;
  const elasticHours = elastic.reduce((a, b) => a + b, 0);
  const saved = Math.round((1 - elasticHours / fixedHours) * 100);
  const W = 480, H = 170, pad = 6, bw = (W - pad * 2) / 24;
  const yMax = Math.max(fixed, ...elastic) * perServer * 1.08;
  const y = (v: number) => H - (v / yMax) * (H - 14);
  return (
    <div className="card grid gap-6 p-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <h3 className="font-bold">☁️ Try it: fixed servers vs Auto Scaling, over one day</h3>
        <Slider label="Traffic multiplier (try Diwali = 5x)" value={boost} set={setBoost} min={1} max={10} stepV={1} show={`${boost}x`} />
        <Slider label="Orders one server can handle per minute" value={perServer} set={setPerServer} min={50} max={300} stepV={25} />
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Fixed fleet" value={`${fixedHours} srv-h`} tone="rose" />
          <Stat label="Auto Scaling" value={`${elasticHours} srv-h`} tone="emerald" />
          <Stat label="Saved" value={`${saved}%`} tone="sky" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Per day at the t3.micro Mumbai price (${T3_MICRO_MUMBAI}/hour): fixed <b>{usd(fixedHours * T3_MICRO_MUMBAI)}</b> vs elastic <b>{usd(elasticHours * T3_MICRO_MUMBAI)}</b>.
          Over 30 days: <b>{usd(fixedHours * T3_MICRO_MUMBAI * 30)}</b> vs <b>{usd(elasticHours * T3_MICRO_MUMBAI * 30)}</b>.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">“srv-h” = server-hours: 1 server running for 1 hour. You pay for server-hours, so fewer = cheaper. Price: EC2 on-demand Linux t3.micro in ap-south-1, Nov 2026.</p>
      </div>
      <div>
        <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label="Orders per hour with fixed and auto-scaled server capacity">
          {load.map((l, i) => (
            <motion.rect key={i} x={pad + i * bw + 1.5} width={bw - 3} rx={2} className="fill-sky-500/60" animate={{ y: y(l), height: H - y(l) }} transition={spring} />
          ))}
          <motion.line x1={pad} x2={W - pad} className="stroke-rose-500" strokeWidth={2.5} strokeDasharray="6 4" animate={{ y1: y(fixed * perServer), y2: y(fixed * perServer) }} transition={spring} />
          <motion.path fill="none" className="stroke-emerald-500" strokeWidth={2.5}
            animate={{ d: `M${pad},${y(elastic[0] * perServer)} ` + elastic.map((e, i) => `V${y(e * perServer)} H${pad + (i + 1) * bw}`).join(" ") }} transition={spring} />
          {[0, 6, 12, 18, 23].map((h) => <text key={h} x={pad + h * bw + bw / 2} y={H + 15} textAnchor="middle" className="fill-slate-500 text-[10px]">{h}:00</text>)}
        </svg>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-sky-500/60" />Orders that hour</span>
          <span><span className="mr-1 inline-block h-0.5 w-4 bg-rose-500 align-middle" />Fixed capacity (bought for the peak)</span>
          <span><span className="mr-1 inline-block h-0.5 w-4 bg-emerald-500 align-middle" />Auto Scaling capacity (follows demand)</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Lesson 0.4: VMs vs containers ---------------- */
function DensityCompare() {
  const [services, setServices] = useState(8);
  // Typical, rounded numbers for a small Java microservice. Real values vary.
  const vm = { osGb: 1.0, appGb: 0.35, bootS: 45, imageGb: 8 };
  const ct = { osGb: 0.0, appGb: 0.35, bootS: 2, imageGb: 0.2 };
  const vmRam = services * (vm.osGb + vm.appGb);
  const ctRam = services * (ct.osGb + ct.appGb) + 0.5; // + one shared host OS
  const rows: [string, string, string][] = [
    ["RAM needed", `${vmRam.toFixed(1)} GB`, `${ctRam.toFixed(1)} GB`],
    ["Time to start one copy", `~${vm.bootS} s`, `~${ct.bootS} s`],
    ["Size of one package", `~${vm.imageGb} GB (VM image)`, `~${Math.round(ct.imageGb * 1000)} MB (container image)`],
    ["Full operating systems running", String(services), "1 (shared)"],
  ];
  return (
    <div className="card space-y-5 p-5">
      <h3 className="font-bold">📦 Try it: run FoodDash's microservices as VMs or as containers</h3>
      <Slider label="Number of microservices (Menu, Orders, Payments, Delivery...)" value={services} set={setServices} min={1} max={30} stepV={1} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-sm">🧩 One VM per service: <b>{vmRam.toFixed(1)} GB RAM</b></div>
          <Bar pct={(vmRam / (30 * 1.35)) * 100} from="from-rose-500" to="to-amber-400" />
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.from({ length: services }).map((_, i) => (
              <motion.div key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="overflow-hidden rounded ring-1 ring-rose-400/50">
                <div className="bg-rose-500/25 px-1 font-mono text-[8px]">guest OS</div>
                <div className="bg-amber-500/30 px-1 font-mono text-[8px]">app</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm">📦 One container per service: <b>{ctRam.toFixed(1)} GB RAM</b></div>
          <Bar pct={(ctRam / (30 * 1.35)) * 100} />
          <div className="mt-2 rounded ring-1 ring-emerald-500/50">
            <div className="flex flex-wrap gap-1 p-1">
              {Array.from({ length: services }).map((_, i) => (
                <motion.span key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded bg-emerald-500/30 px-1 font-mono text-[8px]">app</motion.span>
              ))}
            </div>
            <div className="bg-emerald-500/20 px-1 text-center font-mono text-[9px]">one shared host OS kernel</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-xs uppercase text-slate-500"><th className="py-1 pr-3"></th><th className="py-1 pr-3">VMs</th><th className="py-1">Containers</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-slate-200 dark:border-slate-800"><td className="py-1.5 pr-3 font-semibold">{r[0]}</td><td className="py-1.5 pr-3">{r[1]}</td><td className="py-1.5">{r[2]}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Typical, rounded numbers for a small Java service (guest OS about 1 GB, app about 350 MB). Your real numbers will differ; the gap is the point.</p>
    </div>
  );
}

/* ---------------- Lesson 0.5: Lambda vs always-on EC2 ---------------- */
const REQ_STEPS = [10_000, 100_000, 1_000_000, 3_000_000, 10_000_000, 30_000_000, 100_000_000, 300_000_000];
const LAMBDA_REQ = 0.2 / 1_000_000; // USD per request
const LAMBDA_GBS = 0.0000166667; // USD per GB-second, x86
const FREE_REQ = 1_000_000;
const FREE_GBS = 400_000;

function ServerlessCost() {
  const [ri, setRi] = useState(2);
  const [ms, setMs] = useState(120);
  const [mem, setMem] = useState(512);
  const reqs = REQ_STEPS[ri];
  const gbs = reqs * (ms / 1000) * (mem / 1024);
  const lambdaReq = Math.max(0, reqs - FREE_REQ) * LAMBDA_REQ;
  const lambdaCompute = Math.max(0, gbs - FREE_GBS) * LAMBDA_GBS;
  const lambda = lambdaReq + lambdaCompute;
  const ec2 = 2 * T3_MICRO_MUMBAI * 730; // two t3.micro for high availability, 730 h per month
  const cheaper = lambda < ec2;
  return (
    <div className="card grid gap-6 p-5 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="font-bold">⚡ Try it: what would the “place order” function cost per month?</h3>
        <Slider label="Orders (function calls) per month" value={ri} set={setRi} min={0} max={REQ_STEPS.length - 1} stepV={1} show={reqs.toLocaleString("en-IN")} />
        <Slider label="How long one call runs" value={ms} set={setMs} min={10} max={3000} stepV={10} show={`${ms} ms`} />
        <Slider label="Memory given to the function" value={mem} set={setMem} min={128} max={3008} stepV={64} show={`${mem} MB`} />
        <p className="text-xs text-slate-500 dark:text-slate-400">Compute used: <b>{Math.round(gbs).toLocaleString("en-IN")} GB-seconds</b> (memory in GB × seconds run × calls).</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Lambda / month" value={usd(lambda)} tone={cheaper ? "emerald" : "rose"} />
          <Stat label="2 × EC2 always on" value={usd(ec2)} tone={cheaper ? "rose" : "emerald"} />
        </div>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <li>Requests: {reqs.toLocaleString("en-IN")} − 1,000,000 free = {Math.max(0, reqs - FREE_REQ).toLocaleString("en-IN")} billable → <b>{usd(lambdaReq)}</b></li>
          <li>Compute: {Math.round(gbs).toLocaleString("en-IN")} − 400,000 free GB-s → <b>{usd(lambdaCompute)}</b></li>
        </ul>
        <motion.p key={String(cheaper)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-3 text-sm font-semibold ${cheaper ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
          {cheaper ? "Serverless wins: you pay only when an order actually comes in." : "At this steady, heavy load, always-on servers are cheaper. Serverless is not always the answer."}
        </motion.p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Prices: Lambda x86 $0.20 per 1M requests + $0.0000166667 per GB-second, always-free tier 1M requests + 400,000 GB-s per month. EC2: t3.micro Linux on-demand, Mumbai (ap-south-1) ${T3_MICRO_MUMBAI}/h × 730 h × 2. Checked Nov 2026. Ignores API Gateway, data transfer and logs.</p>
      </div>
    </div>
  );
}

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case "capacity": return <CapacityCalculator />;
    case "consolidation": return <ConsolidationSimulator />;
    case "elastic": return <ElasticSimulator />;
    case "density": return <DensityCompare />;
    case "serverless-cost": return <ServerlessCost />;
  }
}
