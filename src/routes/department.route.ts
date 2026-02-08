import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    createDepartmentController, 
    deleteDepartmentController, 
    getDepartmentByIdController, 
    getDepartmentsController, 
    updateDepartmentController 
} from "../controllers/department.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getDepartmentsController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getDepartmentByIdController);
router.post("/", rbacMiddleware(["Admin"]), createDepartmentController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateDepartmentController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteDepartmentController);

export default router;