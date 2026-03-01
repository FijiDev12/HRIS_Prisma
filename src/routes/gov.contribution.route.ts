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

router.post("/", rbacMiddleware(["ADMIN", "HR"]), createGovContributionController);
router.get("/:id", getGovContributionByIdController);
router.get("/", getAllGovContributionsController);
router.patch("/:id", rbacMiddleware(["ADMIN", "HR"]), updateGovContributionController);
router.delete("/:id", rbacMiddleware(["ADMIN", "HR"]), deleteGovContributionController);

export default router;