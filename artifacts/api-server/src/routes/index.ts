import { Router, type IRouter } from "express";
import healthRouter from "./health";
import userRouter from "./user";
import dashboardRouter from "./dashboard";
import transactionsRouter from "./transactions";
import questsRouter from "./quests";
import simulationRouter from "./simulation";
import messagesRouter from "./messages";
import bossRouter from "./boss";

const router: IRouter = Router();

router.use(healthRouter);
router.use(userRouter);
router.use(dashboardRouter);
router.use(transactionsRouter);
router.use(questsRouter);
router.use(simulationRouter);
router.use(messagesRouter);
router.use(bossRouter);

export default router;
