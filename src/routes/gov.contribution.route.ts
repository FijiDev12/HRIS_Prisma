import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { rbacMiddleware } from "../middleware/rbac.middleware";
import {
    createGovContributionController,
    deleteGovContributionController,
    getAllGovContributionsController,
    getGovContributionByIdController,
    updateGovContributionController
} from "../controllers/gov.contribution.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", rbacMiddleware(["ADMIN"]), createGovContributionController);
router.get("/:id", rbacMiddleware(["ADMIN", "EMPLOYEE"]), getGovContributionByIdController);
router.get("/", rbacMiddleware(["ADMIN"]), getAllGovContributionsController);
router.patch("/:id", rbacMiddleware(["ADMIN"]), updateGovContributionController);
router.delete("/:id", rbacMiddleware(["ADMIN"]), deleteGovContributionController);

export default router;