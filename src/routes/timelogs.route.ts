import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTimeLogController } from "../controllers/timelogs.controller";

const router = Router();

router.use(authMiddleware);

router.get("/log", createTimeLogController);

export default router;