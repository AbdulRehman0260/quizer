import {pgTable, serial, text, varchar, timestamp, uuid} from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
});

export type User = {
  email: string;
};

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').unique().notNull(),
  options: text('options').array().notNull(),
  answer: text('answer').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
});
  
export type Question = {
  question: string;
  options: string[];
  answer: string;
};