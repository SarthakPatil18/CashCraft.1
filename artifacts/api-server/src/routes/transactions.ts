import { Router } from "express";
import { db, transactionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListTransactionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/transactions", async (req, res) => {
  try {
    const parsed = ListTransactionsQueryParams.safeParse(req.query);
    const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;

    const txns = await db
      .select()
      .from(transactionsTable)
      .orderBy(desc(transactionsTable.date))
      .limit(limit);

    res.json(
      txns.map((t) => ({
        id: String(t.id),
        description: t.description,
        amount: t.amount,
        category: t.category,
        type: t.type,
        date: t.date.toISOString(),
        impactScore: t.impactScore,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error fetching transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
