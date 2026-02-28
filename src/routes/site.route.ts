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

router.get("/", rbacMiddleware(["ADMIN", "EMPLOYEE", "GUEST", "EXECUTIVE", "HR"]), getSitesController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE", "GUEST", "EXECUTIVE", "HR"]), getSiteByIdController);
router.post("/", rbacMiddleware(["ADMIN", "HR"]), createSiteController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateSiteController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteSiteController);

export default router;