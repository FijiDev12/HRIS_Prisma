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

router.get("/", rbacMiddleware(["ADMIN"]), getShiftsController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getShiftByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createShiftController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateShiftController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteShiftController);

export default router;