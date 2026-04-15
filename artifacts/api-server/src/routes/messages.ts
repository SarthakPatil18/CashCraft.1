import { Router } from "express";
import { db, messagesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/messages/future", async (req, res) => {
  try {
    const messages = await db.select().from(messagesTable).orderBy(desc(messagesTable.date));
    res.json(
      messages.map((m) => ({
        id: String(m.id),
        from: m.from,
        subject: m.subject,
        body: m.body,
        tone: m.tone,
        date: m.date.toISOString(),
        read: m.read,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Error fetching future messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
