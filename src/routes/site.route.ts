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

router.get("/", rbacMiddleware(["ADMIN"]), getSitesController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getSiteByIdController);
router.post("/", rbacMiddleware(["ADMIN"]), createSiteController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateSiteController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteSiteController);

export default router;