import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    createPositionController, 
    deletePositionController, 
    getPositionByIdController, 
    getPositionsController, 
    updatePositionController 
} from "../controllers/position.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getPositionsController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getPositionByIdController);
router.post("/", rbacMiddleware(["Admin"]), createPositionController);
router.patch("/:id", rbacMiddleware(["Admin"]), updatePositionController);
router.delete("/:id", rbacMiddleware(["Admin"]), deletePositionController);

export default router;