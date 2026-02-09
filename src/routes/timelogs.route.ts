import { Router } from "express";
import { createTimeLogController } from "../controllers/timelogs.controller";

const router = Router();

router.get("/timelogs", createTimeLogController);

export default router;