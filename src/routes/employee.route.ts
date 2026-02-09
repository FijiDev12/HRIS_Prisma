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
    getEmployeeShiftByEmpIdController, 
    getEmployeeShiftsController, 
    getEmploymentStatusByIdController, 
    getEmploymentStatusController, 
    updateEmployeeController, 
    updateEmploymentStatusController
} from "../controllers/employee.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN"]), getEmployeesController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmployeeByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createEmployeeController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateEmployeeController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteEmployeeController);

router.post("/assign/schedule", rbacMiddleware(["ADMIN"]), assignShiftToEmployeeCont);
router.get("/assign/schedule", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmployeeShiftsController);
router.get("/assign/schedule/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmployeeShiftByEmpIdController);

router.get("/status", rbacMiddleware(["ADMIN"]), getEmploymentStatusController);
router.get("/status/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmploymentStatusByIdController);
router.post("/status", rbacMiddleware(["ADMIN"]), createEmploymentStatusController);
router.patch("/status/:id", rbacMiddleware(["ADMIN"]), updateEmploymentStatusController);
router.delete("/status/:id", rbacMiddleware(["ADMIN"]), deleteEmploymentStatusController);

export default router;