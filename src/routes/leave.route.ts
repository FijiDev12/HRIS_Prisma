import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    approveLeaveRequestController,
    createLeaveBalanceController,
    createLeaveController,
    createLeaveRequestController,
    deleteLeaveBalanceController,
    deleteLeaveController,
    getLeaveBalanceByEmpIdController,
    getLeaveBalanceByIdController,
    getLeaveBalanceController,
    getLeaveByIdController,
    getLeaveRequestByEmpIdController,
    getLeaveRequestByIdController,
    getLeaveRequestController,
    getLeavesController,
    rejectLeaveRequestController,
    updateLeaveBalanceController,
    updateLeaveController
} from "../controllers/leave.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getLeavesController);
router.get("/:id", getLeaveByIdController);
router.post("/", createLeaveController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateLeaveController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteLeaveController);

router.get("/request/employee", getLeaveRequestController);
router.get("/request/employee/:empid", getLeaveRequestByEmpIdController);
router.get("/request/employee/:id", getLeaveRequestByIdController);
router.post("/request", createLeaveRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveLeaveRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectLeaveRequestController);

router.get("/balance/all", getLeaveBalanceController);
router.get("/balance/:id", getLeaveBalanceByIdController);
router.get("/balance/employee/:empid", getLeaveBalanceByEmpIdController);
router.post("/balance", rbacMiddleware(["ADMIN", "HR"]), createLeaveBalanceController);
router.patch("/balance/:id", rbacMiddleware(["ADMIN", "HR"]), updateLeaveBalanceController);
router.delete("/balance/:id", rbacMiddleware(["ADMIN", "HR"]), deleteLeaveBalanceController);

export default router;