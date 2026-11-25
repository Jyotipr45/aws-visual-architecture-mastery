/**
 * Renders lesson data (src/lessonNN.ts) into the Markdown page that lives in the
 * module folder, so GitHub readers and app users get exactly the same content.
 *
 * Usage (Node 22+):  node --experimental-strip-types scripts/gen-lesson-md.ts 0.2 0.3
 * Lesson 0.1's Markdown was written by hand first and is not regenerated.
 */
import { writeFileSync } from "node:fs";
import type { Lesson, Table } from "../src/lessonTypes.ts";

const APP = "https://jyotipr45.github.io/aws-visual-architecture-mastery/visual-app/";
const FOLDERS: Record<string, string> = { "00": "00-history-and-cloud-evolution" };

const table = (t: Table) =>
  [`| ${t.head.join(" | ")} |`, `|${t.head.map(() => "---").join("|")}|`, ...t.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");

const fence = (code: string, lang = "powershell") => "```" + lang + "\n" + code + "\n```";

function storyFlow(l: Lesson) {
  const ids = l.storySteps.map((_, i) => `S${i + 1}`);
  const nodes = l.storySteps.map((s, i) => `    ${ids[i]}["${s.icon} ${s.title}<br/>${s.text.replace(/"/g, "'")}"]`);
  const links = ids.slice(1).map((id, i) => `    ${ids[i]} --> ${id}`);
  const styles = l.storySteps.map((s, i) => `    style ${ids[i]} fill:#1e293b,stroke:${s.slow ? "#f87171" : "#94a3b8"},color:#f8fafc`);
  return "```mermaid\nflowchart LR\n" + [...nodes, ...links, "", ...styles].join("\n") + "\n```";
}

export function render(l: Lesson, prev?: Lesson): string {
  const out: string[] = [];
  out.push(`# Lesson ${l.id} · ${l.title}`, "");
  out.push(`> ${l.meta.join(" · ")}`, ">");
  out.push(`> 🎬 **Watch first:** [Cloud Evolution Timeline, Era ${l.eraIndex + 1}](${APP}) (click any box or arrow in it to inspect it)`, ">");
  out.push(`> 📖 **Interactive version of this lesson:** [open Lesson ${l.id} in the app](${APP}#lesson-${l.id}) (try-it simulator, copy buttons, reveal-the-answer cards)`, "");
  out.push(`**The one idea of this lesson:** ${l.bigIdea}`, "", "---", "");

  out.push(`## 1. ${l.storyHeading}`, "", l.storyIntro, "", storyFlow(l), "");
  l.storyOutro.forEach((p) => out.push(p, ""));
  if (l.diagram) out.push("```mermaid\n" + l.diagram.trim() + "\n```", "");
  out.push("---", "");

  out.push("## 2. Every word, explained", "");
  out.push(table({ head: ["Word", "Nickname / alias", "What it means in plain English", "Why it matters for FoodDash"], rows: l.glossary.map((g) => [`**${g.word}**`, g.alias, g.meaning, g.foodDash]) }), "", "---", "");

  out.push(`## 3. ${l.ideasHeading}`, "");
  l.ideas.forEach((i) => {
    out.push(`### ${i.icon} ${i.title}`, i.text, "");
    if (i.table) out.push(table(i.table), "");
  });
  if (l.widget) out.push(`> 🎛️ **Try it live:** the [interactive version of this lesson](${APP}#lesson-${l.id}) has a simulator for this section. Drag the sliders and watch the numbers change.`, "");
  out.push("---", "");

  out.push(`## 4. 🧪 ${l.labHeading}`, "");
  out.push(`**Goal:** ${l.lab.goal}  `, `**Cost:** ${l.lab.cost}  `, `**Where:** ${l.lab.where}`, "");
  if (l.lab.before) { out.push("**Before you start:**", ""); l.lab.before.forEach((b) => out.push(`- ${b}`)); out.push(""); }
  l.lab.steps.forEach((s) => {
    out.push(`### ${s.title}`, "", fence(s.code, s.lang), "");
    if (s.output) out.push("Expected output:", fence(s.output, "text"), "");
    out.push(s.after, "");
  });
  out.push("---", "");

  out.push("## 5. 🤔 What happens if...?", "", "Think about your answer first, then click to reveal it.", "");
  l.whatIfs.forEach((w, i) => out.push("<details>", `<summary><b>${i + 1}. ${w.q}</b></summary>`, "", w.a, "</details>", ""));
  out.push("---", "");

  out.push("## 6. 🧹 Cleanup (mandatory)", "");
  l.cleanup.forEach((c, i) => out.push(`${i + 1}. ${c}`));
  out.push("", l.cleanupDone, "", "---", "");

  out.push("## 7. Key takeaways", "");
  l.takeaways.forEach((t) => out.push(`- ${t}`));
  out.push("", "---", "");
  const back = prev ? `⬅️ [Lesson ${prev.id}: ${prev.shortTitle}](./${prev.file}) · ` : "";
  out.push(`${back}[Module ${l.module} overview](./README.md) · ➡️ **Next:** ${l.next}`, "");
  return out.join("\n");
}

// Lesson files only use `import type`, which Node strips, so they load without a bundler.
const fileFor = (id: string) => `../src/lesson${id.replace(".", "").padStart(2, "0")}.ts`;
const load = async (id: string): Promise<Lesson | undefined> => {
  try { const m = await import(fileFor(id)); return Object.values(m)[0] as Lesson; } catch { return undefined; }
};
for (const id of process.argv.slice(2)) {
  const l = await load(id);
  if (!l) throw new Error(`No lesson ${id}`);
  const [maj, min] = id.split(".").map(Number);
  const prev = min > 1 ? await load(`${maj}.${min - 1}`) : undefined;
  const path = new URL(`../../${FOLDERS[l.module]}/${l.file}`, import.meta.url);
  writeFileSync(path, render(l, prev));
  console.log(`wrote ${FOLDERS[l.module]}/${l.file}`);
}
