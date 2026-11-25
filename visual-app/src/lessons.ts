/** Every lesson in the app, in course order. Add a new lesson file here to publish it. */
import { LESSON01 } from "./lesson01";
import { LESSON02 } from "./lesson02";
import { LESSON03 } from "./lesson03";
import type { Lesson } from "./lessonTypes";

export const LESSONS: Lesson[] = [LESSON01, LESSON02, LESSON03];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
