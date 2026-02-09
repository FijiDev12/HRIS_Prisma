import { Router } from "express";
import { 
    loginController, 
    refreshController, 
    logoutController 
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);
router.post("/refresh-token", refreshController);
router.post("/logout", authMiddleware, logoutController);

export default router;
