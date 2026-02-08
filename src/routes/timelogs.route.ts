import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { createTimeLogController } from "../controllers/timelogs.controller";

const router = Router();

router.use(authMiddleware);

router.get("/log", rbacMiddleware(["Admin", "Employee"]), createTimeLogController);

export default router;