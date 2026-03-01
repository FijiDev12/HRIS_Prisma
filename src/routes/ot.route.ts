import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    approveOtRequestController,
    createOtRequestController,
    getOtRequestByEmpIdController,
    getOtRequestByIdController,
    getOtRequestController,
    rejectOtRequestController
} from "../controllers/ot.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getOtRequestController);
router.get("/:id", getOtRequestByIdController);
router.get("/emp/:empid", getOtRequestByEmpIdController);
router.post("/", createOtRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveOtRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectOtRequestController);

export default router;