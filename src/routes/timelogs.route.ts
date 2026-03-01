import { Router } from "express";
import { createTimeLogController, getTimelogsBySiteIdController } from "../controllers/timelogs.controller";
import multer from "multer";

export const uploadSelfie = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post("/", uploadSelfie.single("selfie"), createTimeLogController);
router.get("/site/:id", getTimelogsBySiteIdController);

export default router;