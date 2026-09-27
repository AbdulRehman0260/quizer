import {pgTable, serial, text, varchar, timestamp, uuid} from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  userName: varchar('user_name', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
});

export type User = {
  userName: string;
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

//We will need to amend the database for the users table which would store high scores for each user. This will be a new table called "user_scores" 
// which will have a foreign key relationship with the users table.
export const userScores = pgTable('user_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  score: serial('score').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
});

export type UserScore = {
  userId: string;
  score: number;
};