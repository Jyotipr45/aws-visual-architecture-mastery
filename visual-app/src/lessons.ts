/** Every lesson in the app, in course order. Add a new lesson file here to publish it. */
import { LESSON01 } from "./lesson01";
import { LESSON02 } from "./lesson02";
import { LESSON03 } from "./lesson03";
import { LESSON04 } from "./lesson04";
import { LESSON05 } from "./lesson05";
import type { Lesson } from "./lessonTypes";

export const LESSONS: Lesson[] = [LESSON01, LESSON02, LESSON03, LESSON04, LESSON05];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
