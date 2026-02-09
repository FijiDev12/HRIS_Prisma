import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    createRestdayController, 
    deleteRestdayController, 
    getRestdayByIdController, 
    getRestdayController, 
    updateRestdayController 
} from "../controllers/restday.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getRestdayController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getRestdayByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createRestdayController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateRestdayController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteRestdayController);

export default router;