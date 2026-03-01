import { Router } from "express";
import {
    generatePayroll,
    getPayrollByPeriod,
    softDeletePayroll,
    reversePayroll,
    createPayrollPeriod,
    postPayrollPeriod,
    softDeletePayrollPeriod,
    approvePayrollPeriod,
    unlockPayroll,
    getPayrollByEmployeeId,
} from "../controllers/payroll.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/generate", rbacMiddleware(["ADMIN", "HR"]), generatePayroll);
router.get("/period/:periodId", rbacMiddleware(["ADMIN", "HR"]), getPayrollByPeriod);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), softDeletePayroll);
router.patch("/reverse/:id", rbacMiddleware(["ADMIN", "HR"]), reversePayroll);

router.post("/period", rbacMiddleware(["ADMIN", "HR"]), createPayrollPeriod);
router.post("/period/post/:id", rbacMiddleware(["ADMIN", "HR"]), postPayrollPeriod);
router.delete("/period/:id", rbacMiddleware(["ADMIN", "HR"]), softDeletePayrollPeriod);
router.patch("/period/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approvePayrollPeriod);
router.patch("/period/unlock/:id", rbacMiddleware(["ADMIN", "HR"]), unlockPayroll);

router.get("/employee/:employeeId/period/:periodId", getPayrollByEmployeeId);

export default router;