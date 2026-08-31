import { db } from "../index.js";
import { questions } from "../schema.js";
import type { Question } from "../schema.js";
import {sql} from "drizzle-orm";

export const batchQuestions = async (questionsArray: Question[]) => {
  await db.insert(questions).values(questionsArray).onConflictDoNothing().returning();
};

export const questionPull = async () => {
   return await db.select().from(questions).orderBy(sql`random()`).limit(15);
};