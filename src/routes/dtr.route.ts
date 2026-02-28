import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { getDTRDateRangeController } from "../controllers/dtr.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN", "EMPLOYEE", "GUEST", "EXECUTIVE", "HR"]), getDTRDateRangeController);

export default router;