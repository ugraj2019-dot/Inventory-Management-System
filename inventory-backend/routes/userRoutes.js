import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";
import { listUsers, updateUserRole, deleteUser } from "../controllers/userControllers.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/", listUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
