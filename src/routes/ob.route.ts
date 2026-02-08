import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    approveObRequestController,
    createObRequestController,
    getObRequestByIdController, 
    getObRequestController, 
    rejectObRequestController
} from "../controllers/ob.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getObRequestController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getObRequestByIdController);
router.post("/", rbacMiddleware(["Admin"]), createObRequestController);
router.patch("/approve/:id", rbacMiddleware(["Admin", "HR"]), approveObRequestController);
router.patch("/reject/:id", rbacMiddleware(["Admin", "HR"]), rejectObRequestController);

export default router;