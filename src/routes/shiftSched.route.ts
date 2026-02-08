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

router.get("/", rbacMiddleware(["Admin"]), getShiftsController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getShiftByIdController);
router.post("/", rbacMiddleware(["Admin"]), createShiftController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateShiftController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteShiftController);

export default router;