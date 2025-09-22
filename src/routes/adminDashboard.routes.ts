// backend/routes/admin/dashboard.ts
import { Router } from "express";
import { getDashboardCounts } from "../controllers/dashboard.controllers";


const router = Router();

router.get("/", getDashboardCounts);

export default router;
