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

router.get("/", rbacMiddleware(["ADMIN", "HR"]), getEmployeesController);
router.get("/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getEmployeeByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE", "GUEST", "EMPLOYEE"]), upload.single("profilePhoto"), createEmployeeController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE", "GUEST", "EMPLOYEE"]), upload.single("profilePhoto"), updateEmployeeController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE", "GUEST"]), deleteEmployeeController);

router.post("/assign/schedule", rbacMiddleware(["ADMIN", "HR"]), assignShiftToEmployeeCont);
router.get("/assign/schedule", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getEmployeeShiftsController);
router.get("/assign/schedule/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getEmployeeShiftByEmpIdController);

router.get("/status", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE", "GUEST", "EMPLOYEE"]), getEmploymentStatusController);
router.get("/status/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getEmploymentStatusByIdController);
router.post("/status", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE"]), createEmploymentStatusController);
router.patch("/status/:id", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE"]), updateEmploymentStatusController);
router.delete("/status/:id", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE"]), deleteEmploymentStatusController);

router.post("/attendance/correction", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), createAttendanceCorrectionController);
router.post("/attendance/correction/approve", rbacMiddleware(["ADMIN", "HR"]), approveAttendanceCorrectionController);
router.post("/attendance/correction/reject", rbacMiddleware(["ADMIN", "HR"]), rejectAttendanceCorrectionController);
router.get("/attendance/correction", rbacMiddleware(["ADMIN", "HR", "EXECUTIVE"]), getAttendanceCorrectionController);
router.get("/attendance/correction/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getAttendanceCorrectionByIdController);
router.get("/attendance/correction/employee/:employeeId", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getAttendanceCorrectionByEmployeeIdController);

export default router;