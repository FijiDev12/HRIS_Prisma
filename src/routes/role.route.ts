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

router.get("/", rbacMiddleware(["Admin"]), getRolesController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getRoleByIdController);
router.post("/", rbacMiddleware(["Admin"]), createRoleController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateRoleController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteRoleController);

export default router;