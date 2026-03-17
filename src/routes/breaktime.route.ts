import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createBreakTimeController,
    deleteBreakTimeController,
    getBreakTimeByIdController,
    getBreakTimesController,
    updateBreakTimeController
} from "../controllers/breaktime.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getBreakTimesController);
router.get("/:id", getBreakTimeByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createBreakTimeController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateBreakTimeController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteBreakTimeController);

export default router;