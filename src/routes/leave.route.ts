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

router.get("/", rbacMiddleware(["ADMIN"]), getLeavesController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createLeaveController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateLeaveController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteLeaveController);

router.get("/request", rbacMiddleware(["ADMIN"]), getLeaveRequestController);
router.get("/request/employee/:empid", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveRequestByEmpIdController);
router.get("/request/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveRequestByIdController);
router.post("/request", rbacMiddleware(["ADMIN"]), createLeaveRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveLeaveRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectLeaveRequestController);

router.get("/balance/all", rbacMiddleware(["ADMIN"]), getLeaveBalanceController);
router.get("/balance/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveBalanceByIdController);
router.get("/balance/employee/:empid", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveBalanceByEmpIdController);
router.post("/balance", rbacMiddleware(["ADMIN"]), createLeaveBalanceController);
router.patch("/balance/:id", rbacMiddleware(["ADMIN"]), updateLeaveBalanceController);
router.delete("/balance/:id", rbacMiddleware(["ADMIN"]), deleteLeaveBalanceController);

export default router;