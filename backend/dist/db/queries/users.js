import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getUserByUserName(username) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.userName, username));
    return result;
}
