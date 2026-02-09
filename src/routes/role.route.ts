import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    createRoleController,
    deleteRoleController,
    getRoleByIdController, 
    getRolesController, 
    updateRoleController
} from "../controllers/role.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN"]), getRolesController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getRoleByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createRoleController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateRoleController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteRoleController);

export default router;