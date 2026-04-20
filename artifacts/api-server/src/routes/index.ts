import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import messagesRouter from "./messages";
import campaignsRouter from "./campaigns";
import paymentsRouter from "./payments";
import storageRouter from "./storage";
import referralsRouter from "./referrals";
import adminRouter from "./admin";
import configRouter from "./config";
import redeemRouter from "./redeem";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(configRouter);
router.use(statsRouter);
router.use("/users", usersRouter);
router.use("/messages", messagesRouter);
router.use("/campaigns", campaignsRouter);
router.use("/payments", paymentsRouter);
router.use("/referrals", referralsRouter);
router.use("/redeem", redeemRouter);
router.use("/admin", adminRouter);
router.use(storageRouter);

export default router;
