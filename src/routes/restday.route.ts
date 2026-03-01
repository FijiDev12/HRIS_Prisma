import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createRestdayController,
    deleteRestdayController,
    getRestdayByIdController,
    getRestdayController,
    updateRestdayController
} from "../controllers/restday.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getRestdayController);
router.get("/:id", getRestdayByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createRestdayController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateRestdayController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteRestdayController);

export default router;