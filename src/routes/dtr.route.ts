import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { getDTRBySiteIdController, getDTRDateRangeController } from "../controllers/dtr.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getDTRDateRangeController);
router.get("/site/:id", rbacMiddleware(["ADMIN", "HR"]), getDTRBySiteIdController);

export default router;