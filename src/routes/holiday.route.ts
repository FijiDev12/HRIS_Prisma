import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    createHolidayController, 
    deleteHolidayController, 
    getHolidayByIdController, 
    getHolidaysController, 
    updateHolidayController 
} from "../controllers/holiday.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getHolidaysController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getHolidayByIdController);
router.post("/", rbacMiddleware(["Admin"]), createHolidayController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateHolidayController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteHolidayController);

export default router;