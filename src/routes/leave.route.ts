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

router.get("/", rbacMiddleware(["ADMIN", "HR"]), getLeavesController);
router.get("/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getLeaveByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), createLeaveController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateLeaveController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteLeaveController);

router.get("/request/employee", rbacMiddleware(["ADMIN", "HR"]), getLeaveRequestController);
router.get("/request/employee/:empid", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getLeaveRequestByEmpIdController);
router.get("/request/employee/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getLeaveRequestByIdController);
router.post("/request", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), createLeaveRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveLeaveRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectLeaveRequestController);

router.get("/balance/all", rbacMiddleware(["ADMIN", "HR"]), getLeaveBalanceController);
router.get("/balance/:id", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getLeaveBalanceByIdController);
router.get("/balance/employee/:empid", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), getLeaveBalanceByEmpIdController);
router.post("/balance", rbacMiddleware(["ADMIN", "HR", "EMPLOYEE", "GUEST", "EXECUTIVE"]), createLeaveBalanceController);
router.patch("/balance/:id", rbacMiddleware(["ADMIN", "HR"]), updateLeaveBalanceController);
router.delete("/balance/:id", rbacMiddleware(["ADMIN", "HR"]), deleteLeaveBalanceController);

export default router;