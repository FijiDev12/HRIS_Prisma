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

router.get("/", rbacMiddleware(["ADMIN"]), getUsersController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getUserByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createUserController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateUserController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteUserController);

export default router;