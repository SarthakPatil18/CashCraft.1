import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/user/profile", async (req, res) => {
  try {
    let users = await db.select().from(usersTable).limit(1);
    if (users.length === 0) {
      await db.insert(usersTable).values({
        name: "Alex Chen",
        level: 4,
        xp: 1850,
        xpToNextLevel: 2500,
        futureScore: 720,
        streak: 12,
        avatarStage: "journeyman",
        monthlyIncome: 7500,
        savingsGoal: 2000,
        balance: 12480,
      });
      users = await db.select().from(usersTable).limit(1);
    }
    const user = users[0];
    res.json({
      id: String(user.id),
      name: user.name,
      level: user.level,
      xp: user.xp,
      xpToNextLevel: user.xpToNextLevel,
      futureScore: user.futureScore,
      streak: user.streak,
      avatarStage: user.avatarStage,
      monthlyIncome: user.monthlyIncome,
      savingsGoal: user.savingsGoal,
      joinedAt: user.joinedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching user profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
