import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createPositionController,
    deletePositionController,
    getPositionByIdController,
    getPositionsController,
    updatePositionController
} from "../controllers/position.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getPositionsController);
router.get("/:id", getPositionByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createPositionController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updatePositionController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deletePositionController);

export default router;