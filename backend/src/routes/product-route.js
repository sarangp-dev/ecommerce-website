import express from "express";
import controller from "../controllers/products.js";
import { uploadProductPhoto } from "../middleware/uploadProductPhoto.js";
import { authMiddleware, adminOnly } from "../middleware/authmiddleware.js";
// Point this to your actual controller file filename (e.g., product.js or payment.js)
import controllers from '../controllers/orderController.js';



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
router.post('/create-payment-intent', controller.paymentWithStripe);

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    controller.stripeWebhook
);
router.post('/payment-success', controller.verifyPaymentSession);



router.get('/getorders', controllers.getAllOrders);
router.put('/updateorderstatus/:id', controllers.updateOrderStatus);

export default router;