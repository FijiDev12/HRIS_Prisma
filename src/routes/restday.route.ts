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

router.get("/", rbacMiddleware(["Admin", "Employee"]), getRestdayController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getRestdayByIdController);
router.post("/", rbacMiddleware(["Admin"]), createRestdayController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateRestdayController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteRestdayController);

export default router;