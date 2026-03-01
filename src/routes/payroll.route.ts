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
} from "../controllers/payroll.controller";

const router = Router();

router.post("/generate", generatePayroll);
router.get("/period/:periodId", getPayrollByPeriod);
router.delete("/:id", softDeletePayroll);
router.patch("/reverse/:id", reversePayroll);

router.post("/period", createPayrollPeriod);
router.post("/period/post/:id", postPayrollPeriod);
router.delete("/period/:id", softDeletePayrollPeriod);
router.patch("/period/approve/:id", approvePayrollPeriod);
router.patch("/period/unlock/:id", unlockPayroll);

export default router;