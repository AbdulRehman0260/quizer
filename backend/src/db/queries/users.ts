import { db } from "../index.js";
import { users } from "../schema.js";
import type { User } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: User) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserByUserName(username: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.userName, username));
  return result;
}