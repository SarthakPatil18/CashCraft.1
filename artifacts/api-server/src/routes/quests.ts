import { Router } from "express";
import { db, questsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CompleteQuestParams } from "@workspace/api-zod";

const router = Router();

router.get("/quests", async (req, res) => {
  try {
    const quests = await db.select().from(questsTable).orderBy(questsTable.id);
    res.json(
      quests.map((q) => ({
        id: String(q.id),
        title: q.title,
        description: q.description,
        xpReward: q.xpReward,
        progress: q.progress,
        target: q.target,
        completed: q.completed,
        category: q.category,
        difficulty: q.difficulty,
        expiresAt: q.expiresAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error fetching quests");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/quests/:questId/complete", async (req, res) => {
  try {
    const parsed = CompleteQuestParams.safeParse({ questId: req.params.questId });
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid quest ID" });
    }

    const questId = parseInt(parsed.data.questId);
    const quests = await db.select().from(questsTable).where(eq(questsTable.id, questId));
    if (quests.length === 0) {
      return res.status(404).json({ error: "Quest not found" });
    }
    const quest = quests[0];
    if (quest.completed) {
      return res.json({ success: false, xpEarned: 0, newLevel: 1, newXp: 0, leveledUp: false, message: "Quest already completed" });
    }

    await db.update(questsTable).set({ completed: true, progress: quest.target }).where(eq(questsTable.id, questId));

    const users = await db.select().from(usersTable).limit(1);
    if (users.length === 0) {
      return res.json({ success: true, xpEarned: quest.xpReward, newLevel: 1, newXp: quest.xpReward, leveledUp: false, message: "Quest completed!" });
    }

    const user = users[0];
    const newXp = user.xp + quest.xpReward;
    let newLevel = user.level;
    let leveledUp = false;

    if (newXp >= user.xpToNextLevel) {
      newLevel = user.level + 1;
      leveledUp = true;
    }

    await db.update(usersTable).set({
      xp: newXp,
      level: newLevel,
      futureScore: Math.min(1000, user.futureScore + 10),
    }).where(eq(usersTable.id, user.id));

    res.json({
      success: true,
      xpEarned: quest.xpReward,
      newLevel,
      newXp,
      leveledUp,
      message: leveledUp ? `Level up! You reached level ${newLevel}!` : `+${quest.xpReward} XP earned!`,
    });
  } catch (err) {
    req.log.error({ err }, "Error completing quest");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
