import { Router } from "express";
import { db, bossesTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { FightBossParams, SurrenderToBossParams } from "@workspace/api-zod";

const router = Router();

router.get("/boss/current", async (req, res) => {
  try {
    const bosses = await db
      .select()
      .from(bossesTable)
      .where(and(eq(bossesTable.active, true), eq(bossesTable.userId, 1)))
      .limit(1);

    if (bosses.length === 0) {
      return res.json({ id: "", name: "", description: "", amount: 0, category: "", scoreRisk: 0, savingsImpact: 0, tier: "miniboss", active: false });
    }

    const boss = bosses[0];
    res.json({
      id: String(boss.id),
      name: boss.name,
      description: boss.description,
      amount: boss.amount,
      category: boss.category,
      scoreRisk: boss.scoreRisk,
      savingsImpact: boss.savingsImpact,
      tier: boss.tier,
      active: boss.active,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching current boss");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/boss/:bossId/fight", async (req, res) => {
  try {
    const parsed = FightBossParams.safeParse({ bossId: req.params.bossId });
    if (!parsed.success) return res.status(400).json({ error: "Invalid boss ID" });

    const bossId = parseInt(parsed.data.bossId);
    const bosses = await db.select().from(bossesTable).where(eq(bossesTable.id, bossId));
    if (bosses.length === 0) return res.status(404).json({ error: "Boss not found" });

    await db.update(bossesTable).set({ active: false }).where(eq(bossesTable.id, bossId));

    const users = await db.select().from(usersTable).limit(1);
    const user = users[0];
    const xpChange = 150;
    const scoreChange = 25;
    const newScore = user ? Math.min(1000, user.futureScore + scoreChange) : 525;

    if (user) {
      await db.update(usersTable).set({
        xp: user.xp + xpChange,
        futureScore: newScore,
        streak: user.streak + 1,
      }).where(eq(usersTable.id, user.id));
    }

    res.json({
      victory: true,
      message: "You defeated the boss! Your financial discipline is legendary. +150 XP",
      scoreChange,
      xpChange,
      newScore,
    });
  } catch (err) {
    req.log.error({ err }, "Error fighting boss");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/boss/:bossId/surrender", async (req, res) => {
  try {
    const parsed = SurrenderToBossParams.safeParse({ bossId: req.params.bossId });
    if (!parsed.success) return res.status(400).json({ error: "Invalid boss ID" });

    const bossId = parseInt(parsed.data.bossId);
    const bosses = await db.select().from(bossesTable).where(eq(bossesTable.id, bossId));
    if (bosses.length === 0) return res.status(404).json({ error: "Boss not found" });

    const boss = bosses[0];
    await db.update(bossesTable).set({ active: false }).where(eq(bossesTable.id, bossId));

    const users = await db.select().from(usersTable).limit(1);
    const user = users[0];
    const xpChange = -50;
    const scoreChange = -boss.scoreRisk;
    const newScore = user ? Math.max(0, user.futureScore + scoreChange) : 450;

    if (user) {
      await db.update(usersTable).set({
        xp: Math.max(0, user.xp + xpChange),
        futureScore: newScore,
        balance: user.balance - boss.amount,
        streak: 0,
      }).where(eq(usersTable.id, user.id));
    }

    res.json({
      victory: false,
      message: "You gave in. Your future self shakes their head. The streak is broken.",
      scoreChange,
      xpChange,
      newScore,
    });
  } catch (err) {
    req.log.error({ err }, "Error surrendering to boss");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
