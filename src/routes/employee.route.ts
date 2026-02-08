import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    assignShiftToEmployeeCont,
    createEmployeeController, 
    createEmploymentStatusController, 
    deleteEmployeeController, 
    deleteEmploymentStatusController, 
    getEmployeeByIdController, 
    getEmployeesController, 
    getEmployeeShiftsController, 
    getEmploymentStatusByIdController, 
    getEmploymentStatusController, 
    updateEmployeeController, 
    updateEmploymentStatusController
} from "../controllers/employee.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getEmployeesController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getEmployeeByIdController);
router.post("/", rbacMiddleware(["Admin"]), createEmployeeController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateEmployeeController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteEmployeeController);

router.post("/assign/schedule", rbacMiddleware(["Admin"]), assignShiftToEmployeeCont);
router.get("/schedule", rbacMiddleware(["Admin", "Employee"]), getEmployeeShiftsController);

router.get("/status", rbacMiddleware(["Admin"]), getEmploymentStatusController);
router.get("/status/:id", rbacMiddleware(["Admin", "Employee"]), getEmploymentStatusByIdController);
router.post("/status", rbacMiddleware(["Admin"]), createEmploymentStatusController);
router.patch("/status/:id", rbacMiddleware(["Admin"]), updateEmploymentStatusController);
router.delete("/status/:id", rbacMiddleware(["Admin"]), deleteEmploymentStatusController);

export default router;