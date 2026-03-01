import { Router } from "express";
import { createTimeLogController, getTimelogsBySiteIdController } from "../controllers/timelogs.controller";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";

export const uploadSelfie = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post("/timelogs", uploadSelfie.single("selfie"), createTimeLogController);
router.get("/timelogs/:id", authMiddleware, rbacMiddleware(["Admin", "Employee", "HR", "Executive"]), getTimelogsBySiteIdController);

export default router;