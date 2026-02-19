import { Router } from "express";
import { createTimeLogController } from "../controllers/timelogs.controller";
import multer from "multer";

export const uploadSelfie = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post("/timelogs", uploadSelfie.single("selfie"), createTimeLogController);

export default router;