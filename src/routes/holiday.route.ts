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

router.get("/", getHolidaysController);
router.get("/:id", getHolidayByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createHolidayController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateHolidayController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteHolidayController);

export default router;