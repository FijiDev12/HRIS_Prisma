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

router.get("/", getDepartmentsController);
router.get("/:id", getDepartmentByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createDepartmentController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateDepartmentController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteDepartmentController);

export default router;