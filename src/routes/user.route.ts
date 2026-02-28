import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createUserController,
    deleteUserController,
    getUserByIdController,
    getUsersController,
    updateUserController
} from "../controllers/user.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN", "EXECUTIVE", "HR"]), getUsersController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE", "GUEST", "EXECUTIVE", "HR"]), getUserByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE", "GUEST", "EMPLOYEE"]), createUserController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE"]), updateUserController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE"]), deleteUserController);

export default router;