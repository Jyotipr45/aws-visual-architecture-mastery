/**
 * Shape shared by every lesson. One lesson file fills this in; the app renders it
 * (LessonView.tsx) and scripts/gen-lesson-md.ts renders the same data as Markdown,
 * so the GitHub page and the app never drift apart.
 */

export type WidgetId = "capacity" | "consolidation" | "elastic" | "density" | "serverless-cost";

export interface Table {
  head: string[];
  rows: string[][];
}

export interface StoryStep {
  icon: string;
  title: string;
  text: string;
  /** Highlight this step in red: it is the slow / painful one. */
  slow?: boolean;
}

export interface GlossaryEntry {
  word: string;
  alias: string;
  meaning: string;
  foodDash: string;
}

export interface Idea {
  icon: string;
  title: string;
  text: string;
  table?: Table;
}

export interface LabStep {
  title: string;
  code: string;
  /** Language hint for the Markdown code fence (powershell, text, python...). */
  lang?: string;
  output?: string;
  after: string;
}

export interface Lesson {
  id: string;
  module: string;
  /** Markdown file name inside the module folder. */
  file: string;
  /** Which era of the animated timeline this lesson belongs to (0-based). */
  eraIndex: number;
  title: string;
  shortTitle: string;
  meta: string[];
  bigIdea: string;

  storyHeading: string;
  storyIntro: string;
  storySteps: StoryStep[];
  storyOutro: string[];
  /** Extra Mermaid diagram shown in the Markdown version after the story. */
  diagram?: string;

  glossaryHint: string;
  glossary: GlossaryEntry[];

  ideasHeading: string;
  ideas: Idea[];
  widget?: WidgetId;

  labHeading: string;
  lab: { goal: string; cost: string; where: string; before?: string[]; steps: LabStep[] };

  whatIfs: { q: string; a: string }[];
  cleanup: string[];
  cleanupDone: string;
  takeaways: string[];
  next: string;
}
