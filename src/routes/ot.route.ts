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

router.get("/", rbacMiddleware(["ADMIN"]), getOtRequestController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getOtRequestByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createOtRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveOtRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectOtRequestController);

export default router;