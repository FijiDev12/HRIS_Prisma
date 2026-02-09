import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    approveLeaveRequestController,
    createLeaveController, 
    createLeaveRequestController, 
    deleteLeaveController, 
    getLeaveByIdController, 
    getLeaveRequestByIdController, 
    getLeaveRequestController, 
    getLeavesController, 
    rejectLeaveRequestController, 
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
router.get("/request/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveRequestByIdController);
router.post("/request", rbacMiddleware(["ADMIN"]), createLeaveRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveLeaveRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectLeaveRequestController);

router.get("/balance", rbacMiddleware(["ADMIN"]), getLeavesController);
router.get("/balance/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getLeaveByIdController);
router.post("/balance", rbacMiddleware(["ADMIN"]), createLeaveController);
router.patch("/balance/:id", rbacMiddleware(["ADMIN"]), updateLeaveController);
router.delete("/balance:id", rbacMiddleware(["ADMIN"]), deleteLeaveController);

export default router;