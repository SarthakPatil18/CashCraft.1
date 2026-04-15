import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { RunSimulationBody } from "@workspace/api-zod";

const router = Router();

router.post("/simulation/run", async (req, res) => {
  try {
    const parsed = RunSimulationBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid simulation request" });
    }

    const { amount, description, category } = parsed.data;

    const users = await db.select().from(usersTable).limit(1);
    const user = users[0] || {
      balance: 12480,
      futureScore: 720,
      monthlyIncome: 7500,
      savingsGoal: 2000,
      level: 4,
      avatarStage: "journeyman",
    };

    const incomeRatio = amount / user.monthlyIncome;
    const riskLevel =
      incomeRatio < 0.05 ? "low" :
      incomeRatio < 0.15 ? "medium" :
      incomeRatio < 0.3 ? "high" : "critical";

    const isBossBattle = riskLevel === "critical" || (riskLevel === "high" && amount > 500);

    const disciplinedScoreImpact = Math.floor(amount / 100) * 2;
    const chaoticScoreImpact = -Math.floor(amount / 50) * 5;

    const disciplinedSavings3m = user.savingsGoal * 3 - amount * 0.5;
    const disciplinedSavings1y = user.savingsGoal * 12 - amount * 0.5;
    const chaoticSavings3m = user.savingsGoal * 3 - amount * 1.5;
    const chaoticSavings1y = user.savingsGoal * 12 - amount * 2;

    const stageOrder = ["novice", "apprentice", "journeyman", "master", "legend"];
    const currentStageIdx = stageOrder.indexOf(user.avatarStage);
    const disciplinedAvatarStage = stageOrder[Math.min(stageOrder.length - 1, currentStageIdx + (disciplinedScoreImpact > 20 ? 1 : 0))];
    const chaoticAvatarStage = stageOrder[Math.max(0, currentStageIdx + (chaoticScoreImpact < -30 ? -1 : 0))];

    res.json({
      disciplined: {
        futureBalance: Math.round((user.balance - amount * 0.5) * 100) / 100,
        futureScore: Math.min(1000, user.futureScore + disciplinedScoreImpact),
        scoreImpact: disciplinedScoreImpact,
        savingsIn3Months: Math.max(0, Math.round(disciplinedSavings3m * 100) / 100),
        savingsIn1Year: Math.max(0, Math.round(disciplinedSavings1y * 100) / 100),
        message: `Your disciplined self chose wisely. You found an alternative for ${description} at half the cost. Your savings trajectory remains strong.`,
        avatarStage: disciplinedAvatarStage,
        milestones: [
          "Emergency fund maintained",
          "Investment contributions on track",
          "Debt freedom timeline unchanged",
        ],
      },
      chaotic: {
        futureBalance: Math.round((user.balance - amount) * 100) / 100,
        futureScore: Math.max(0, user.futureScore + chaoticScoreImpact),
        scoreImpact: chaoticScoreImpact,
        savingsIn3Months: Math.max(0, Math.round(chaoticSavings3m * 100) / 100),
        savingsIn1Year: Math.max(0, Math.round(chaoticSavings1y * 100) / 100),
        message: `Your chaotic self caved instantly. ${description} at full price. No regrets... until next month's statement.`,
        avatarStage: chaoticAvatarStage,
        milestones: [
          "Emergency fund depleted by 15%",
          "Savings goal pushed back 6 weeks",
          riskLevel === "critical" ? "Investment portfolio stalled" : "Impulse purchase logged",
        ],
      },
      riskLevel,
      isBossBattle,
    });
  } catch (err) {
    req.log.error({ err }, "Error running simulation");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
