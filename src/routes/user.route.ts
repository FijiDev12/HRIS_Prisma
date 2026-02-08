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

router.get("/", rbacMiddleware(["Admin"]), getUsersController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getUserByIdController);
router.post("/", rbacMiddleware(["Admin"]), createUserController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateUserController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteUserController);

export default router;