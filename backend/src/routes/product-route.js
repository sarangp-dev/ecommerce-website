import express from "express";
import controller from "../controllers/products.js";
import { uploadProductPhoto } from "../middleware/uploadProductPhoto.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
    "/addproduct", authMiddleware,
    uploadProductPhoto,
    controller.addProduct
);
router.get("/getproducts", controller.getAllProducts);

router.put(
    "/editproduct/:id",
    authMiddleware,
    uploadProductPhoto,
    controller.editProduct
);

router.delete("/deleteproduct/:id", authMiddleware, controller.deleteProduct);
export default router;