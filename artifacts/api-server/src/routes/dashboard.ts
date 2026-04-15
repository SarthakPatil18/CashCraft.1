import { Router } from "express";
import { db, usersTable, transactionsTable } from "@workspace/db";
import { desc, gte, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const users = await db.select().from(usersTable).limit(1);
    if (users.length === 0) {
      return res.json({
        balance: 12480,
        futureScore: 720,
        streak: 12,
        xp: 1850,
        level: 4,
        monthlySpend: 2340,
        monthlySavings: 1680,
        savingsRate: 22.4,
        topSpendCategory: "Food & Dining",
        pendingQuestsCount: 3,
        completedQuestsCount: 8,
        scoreChange: 15,
        avatarStage: "journeyman",
      });
    }
    const user = users[0];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const txns = await db
      .select()
      .from(transactionsTable)
      .where(gte(transactionsTable.date, thirtyDaysAgo));

    const debits = txns.filter((t) => t.type === "debit");
    const credits = txns.filter((t) => t.type === "credit");
    const monthlySpend = debits.reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = credits.reduce((sum, t) => sum + t.amount, 0) || user.monthlyIncome;
    const monthlySavings = monthlyIncome - monthlySpend;
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    const categoryCounts: Record<string, number> = {};
    debits.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + t.amount;
    });
    const topSpendCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Food & Dining";

    res.json({
      balance: user.balance,
      futureScore: user.futureScore,
      streak: user.streak,
      xp: user.xp,
      level: user.level,
      monthlySpend: Math.round(monthlySpend * 100) / 100,
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      savingsRate: Math.round(savingsRate * 10) / 10,
      topSpendCategory,
      pendingQuestsCount: 3,
      completedQuestsCount: 8,
      scoreChange: 15,
      avatarStage: user.avatarStage,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/spending-chart", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const txns = await db
      .select()
      .from(transactionsTable)
      .where(gte(transactionsTable.date, fourteenDaysAgo))
      .orderBy(desc(transactionsTable.date));

    const thisWeekTxns = txns.filter((t) => t.date >= sevenDaysAgo && t.type === "debit");
    const lastWeekTxns = txns.filter((t) => t.date < sevenDaysAgo && t.type === "debit");

    const pointsMap: Record<string, { amount: number; category: string }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      pointsMap[key] = { amount: 0, category: "Other" };
    }
    thisWeekTxns.forEach((t) => {
      const key = t.date.toISOString().split("T")[0];
      if (pointsMap[key]) {
        pointsMap[key].amount += t.amount;
        pointsMap[key].category = t.category;
      }
    });

    const points = Object.entries(pointsMap).map(([date, val]) => ({
      date,
      amount: Math.round(val.amount * 100) / 100,
      category: val.category,
    }));

    const totalThisWeek = thisWeekTxns.reduce((s, t) => s + t.amount, 0);
    const totalLastWeek = lastWeekTxns.reduce((s, t) => s + t.amount, 0);
    const weekOverWeekChange = totalLastWeek > 0 ? ((totalThisWeek - totalLastWeek) / totalLastWeek) * 100 : 0;

    res.json({
      points,
      totalThisWeek: Math.round(totalThisWeek * 100) / 100,
      totalLastWeek: Math.round(totalLastWeek * 100) / 100,
      weekOverWeekChange: Math.round(weekOverWeekChange * 10) / 10,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching spending chart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
