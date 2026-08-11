import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
} from "../validators/productValidator.js";
import {
  getProducts,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventorySummary,
} from "../controllers/productControllers.js";

const router = Router();
router.use(requireAuth);
router.get("/summary", getInventorySummary);
router.get("/", getProducts);
router.get("/:id", idParamValidator, validate, getProductByID);
router.post("/", createProductValidator, validate, createProduct);
router.put("/:id", updateProductValidator, validate, updateProduct);
router.delete("/:id", requireAdmin, idParamValidator, validate, deleteProduct);

export default router;
