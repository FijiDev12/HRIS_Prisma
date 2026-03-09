import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createUserController,
    deleteUserController,
    getUserByIdController,
    getUsersController,
    updateUserChangePassController,
    updateUserController
} from "../controllers/user.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getUsersController);
router.get("/:id", getUserByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createUserController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateUserController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteUserController);
router.patch("/change-password/:id", updateUserChangePassController);

export default router;