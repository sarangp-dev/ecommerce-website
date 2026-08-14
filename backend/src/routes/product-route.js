import express from "express";
import controller from "../controllers/products.js";
import { uploadProductPhoto } from "../middleware/uploadProductPhoto.js";

const router = express.Router();

router.post(
    "/addproduct",
    uploadProductPhoto,
    controller.addProduct
);
router.get("/getproducts", controller.getAllProducts);

router.put(
    "/editproduct/:id",
    uploadProductPhoto,
    controller.editProduct
);

router.delete("/deleteproduct/:id", controller.deleteProduct);
export default router;