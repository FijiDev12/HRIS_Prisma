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

router.get("/", rbacMiddleware(["ADMIN"]), getDepartmentsController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getDepartmentByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createDepartmentController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateDepartmentController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteDepartmentController);

export default router;