import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createShiftController,
    deleteShiftController,
    getShiftByIdController,
    getShiftsController,
    updateShiftController
} from "../controllers/shiftSched.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN", "EXECUTIVE", "HR"]), getShiftsController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE", "GUEST", "EXECUTIVE", "HR"]), getShiftByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createShiftController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateShiftController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteShiftController);

export default router;