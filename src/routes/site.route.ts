import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import { 
    createSiteController,
    deleteSiteController,
    getSiteByIdController,
    getSitesController, 
    updateSiteController
} from "../controllers/site.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", rbacMiddleware(["Admin"]), getSitesController);
router.get("/:id", rbacMiddleware(["Admin", "Employee"]), getSiteByIdController);
router.post("/", rbacMiddleware(["Admin"]), createSiteController);
router.patch("/:id", rbacMiddleware(["Admin"]), updateSiteController);
router.delete("/:id", rbacMiddleware(["Admin"]), deleteSiteController);

export default router;