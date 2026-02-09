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

router.get("/", rbacMiddleware(["ADMIN"]), getHolidaysController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getHolidayByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createHolidayController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateHolidayController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteHolidayController);

export default router;