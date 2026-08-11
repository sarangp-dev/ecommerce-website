import express from "express";
import controller from "../controllers/products.js";
import { uploadProductPhoto } from "../middleware/uploadProductPhoto.js";

const router = express.Router();

router.post(
    "/addproduct",
    uploadProductPhoto,
    controller.addProduct
);

export default router;