// src/routes/order.js
import express from 'express';
// Point this to your actual controller file filename (e.g., product.js or payment.js)
import controller from '../controllers/orderController.js';

const router = express.Router();

router.get('/getorders', controller.getAllOrders);
router.put('/updateorderstatus/:id', controller.updateOrderStatus);

export default router;