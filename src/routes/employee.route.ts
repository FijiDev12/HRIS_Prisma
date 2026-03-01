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

router.get("/", getEmployeesController);
router.get("/:id", getEmployeeByIdController);
router.post("/", upload.single("profilePhoto"), createEmployeeController);
router.patch("/:id", upload.single("profilePhoto"), updateEmployeeController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteEmployeeController);

router.post("/assign/schedule", assignShiftToEmployeeCont);
router.get("/assign/schedule", rbacMiddleware(["ADMIN", "HR"]), getEmployeeShiftsController);
router.get("/assign/schedule/:id", getEmployeeShiftByEmpIdController);

router.get("/employment/status", getEmploymentStatusController);
router.get("/employment/status/:id", getEmploymentStatusByIdController);
router.post("/employment/status", rbacMiddleware(["ADMIN", "HR"]), createEmploymentStatusController);
router.patch("/employment/status/:id", rbacMiddleware(["ADMIN", "HR"]), updateEmploymentStatusController);
router.delete("/employment/status/:id", rbacMiddleware(["ADMIN", "HR"]), deleteEmploymentStatusController);

router.post("/attendance/correction", createAttendanceCorrectionController);
router.post("/attendance/correction/approve", rbacMiddleware(["ADMIN", "HR"]), approveAttendanceCorrectionController);
router.post("/attendance/correction/reject", rbacMiddleware(["ADMIN", "HR"]), rejectAttendanceCorrectionController);
router.get("/attendance/correction", getAttendanceCorrectionController);
router.get("/attendance/correction/:id", getAttendanceCorrectionByIdController);
router.get("/attendance/correction/employee/:employeeId", getAttendanceCorrectionByEmployeeIdController);

export default router;