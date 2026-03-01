import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    approveObRequestController,
    createObRequestController,
    getObRequestByEmpIdController,
    getObRequestByIdController,
    getObRequestController,
    rejectObRequestController
} from "../controllers/ob.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getObRequestController);
router.get("/:id", getObRequestByIdController);
router.get("/emp/:empid", getObRequestByEmpIdController);
router.post("/", createObRequestController);
router.patch("/approve/:id", rbacMiddleware(["ADMIN", "HR"]), approveObRequestController);
router.patch("/reject/:id", rbacMiddleware(["ADMIN", "HR"]), rejectObRequestController);

export default router;