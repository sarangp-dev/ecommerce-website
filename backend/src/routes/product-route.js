import express from "express";
import controller from "../controllers/products.js";
import { uploadProductPhoto } from "../middleware/uploadProductPhoto.js";
import { authMiddleware, adminOnly } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
    "/addproduct",
    authMiddleware, adminOnly,
    uploadProductPhoto,
    controller.addProduct
);
router.get("/getproducts", controller.getAllProducts);
router.put(
    "/editproduct/:id",
    authMiddleware, adminOnly,
    uploadProductPhoto,
    controller.editProduct
);
router.delete("/deleteproduct/:id", authMiddleware, adminOnly, controller.deleteProduct);
// router.post('/create-payment-intent', controller.paymentWithStripe);
router.post("/create-payment-intent", (req, res) => {
    console.log("🔥 PAYMENT ROUTE HIT ON RENDER");
    console.log("BODY:", req.body);

    return res.status(200).json({
        success: true,
        message: "Payment route works"
    });
});
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    controller.stripeWebhook
);

export default router;