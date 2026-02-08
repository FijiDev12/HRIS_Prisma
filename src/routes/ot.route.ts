import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    approveOtRequestController, 
    createOtRequestController, 
    getOtRequestByIdController, 
    getOtRequestController, 
    rejectOtRequestController 
} from "../controllers/ot.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getOtRequestController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getOtRequestByIdController);
router.post("/", rbacMiddleware(["Admin"]), createOtRequestController);
router.patch("/approve/:id", rbacMiddleware(["Admin", "HR"]), approveOtRequestController);
router.patch("/reject/:id", rbacMiddleware(["Admin", "HR"]), rejectOtRequestController);

export default router;