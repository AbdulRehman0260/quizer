import { db } from "../index.js";
import { users, userScores } from "../schema.js";
import type { UserScore } from "../schema.js";
import { sql, desc } from "drizzle-orm";

export async function getHighestScorePerUser() {
  const ranked = db
    .select({
      userId: userScores.userId,
      userName: users.userName,
      score: userScores.score,
      rn: sql`ROW_NUMBER() OVER (PARTITION BY ${userScores.userId} ORDER BY ${userScores.score} DESC)`.as('rn')
    })
    .from(userScores)
    .leftJoin(users, sql`${userScores.userId} = ${users.id}`)
    .as('ranked');

  const result = await db
    .select({
      userId: ranked.userId,
      userName: ranked.userName,
      score: ranked.score
    })
    .from(ranked)
    .where(sql`${ranked.rn} = 1`);

  return result;
}

//write to the table when a user finishes a game

export async function createUserScore(userScore: UserScore) {
  const [result] = await db.insert(userScores).values(userScore).returning();
  return result;
}

