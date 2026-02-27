import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    approveAttendanceCorrectionController,
    assignShiftToEmployeeCont,
    createAttendanceCorrectionController,
    createEmployeeController,
    createEmploymentStatusController,
    deleteEmployeeController,
    deleteEmploymentStatusController,
    getAttendanceCorrectionByEmployeeIdController,
    getAttendanceCorrectionByIdController,
    getAttendanceCorrectionController,
    getEmployeeByIdController,
    getEmployeesController,
    getEmployeeShiftByEmpIdController,
    getEmployeeShiftsController,
    getEmploymentStatusByIdController,
    getEmploymentStatusController,
    rejectAttendanceCorrectionController,
    updateEmployeeController,
    updateEmploymentStatusController
} from "../controllers/employee.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN"]), getEmployeesController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmployeeByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), upload.single("profilePhoto"), createEmployeeController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), upload.single("profilePhoto"), updateEmployeeController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteEmployeeController);

router.post("/assign/schedule", rbacMiddleware(["ADMIN"]), assignShiftToEmployeeCont);
router.get("/assign/schedule", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmployeeShiftsController);
router.get("/assign/schedule/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmployeeShiftByEmpIdController);

router.get("/status", rbacMiddleware(["ADMIN"]), getEmploymentStatusController);
router.get("/status/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getEmploymentStatusByIdController);
router.post("/status", rbacMiddleware(["ADMIN"]), createEmploymentStatusController);
router.patch("/status/:id", rbacMiddleware(["ADMIN"]), updateEmploymentStatusController);
router.delete("/status/:id", rbacMiddleware(["ADMIN"]), deleteEmploymentStatusController);

router.post("/attendance/correction", rbacMiddleware(["ADMIN", "EMPLOYEE"]), createAttendanceCorrectionController);
router.post("/attendance/correction/approve", rbacMiddleware(["ADMIN"]), approveAttendanceCorrectionController);
router.post("/attendance/correction/reject", rbacMiddleware(["ADMIN"]), rejectAttendanceCorrectionController);
router.get("/attendance/correction", rbacMiddleware(["ADMIN"]), getAttendanceCorrectionController);
router.get("/attendance/correction/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getAttendanceCorrectionByIdController);
router.get("/attendance/correction/employee/:employeeId", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getAttendanceCorrectionByEmployeeIdController);

export default router;