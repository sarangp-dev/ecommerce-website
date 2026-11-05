import Order from "../models/payment.js";

const getAllOrders = async (req, res) => {
    console.log("🛠️ [API HIT] GET /getorders requested...");
    try {
        // Fetch orders from MongoDB, sort by newest, and populate User and Product details
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "username email") // Pulls username and email from User model
            .populate("items.product", "productName productImage productPrice"); // Pulls product info from Products model

        console.log(`📦 [DB SUCCESS] Found ${orders.length} raw orders in MongoDB.`);

        // Map existing fields to match what your frontend expects
        const formattedOrders = orders.map((order) => {
            const generatedOrderNumber = `YT-${order._id.toString().slice(-6).toUpperCase()}`;

            // Map populated items to ensure name and price match frontend OrderItem interface
            const populatedItems = (order.items || []).map((item) => {
                const productDoc = item.product; // This is now the populated Product document
                return {
                    productId: productDoc ? productDoc._id.toString() : item.product?.toString(),
                    name: productDoc ? productDoc.productName : (item.name || "Product Item"),
                    quantity: item.quantity,
                    price: productDoc ? productDoc.productPrice : (item.price || 0),
                    image: productDoc ? productDoc.productImage : (item.image || null)
                };
            });

            return {
                id: order._id.toString(),
                orderNumber: generatedOrderNumber,
                // Automatically grabs username/email from populated user, with fallbacks
                customerName: order.user?.username || order.customerName || "Valued Customer",
                customerEmail: order.user?.email || order.customerEmail || "customer@yuthi.com",
                shippingAddress: order.shippingAddress || "Kerala, India",
                items: populatedItems,
                totalAmount: order.amount || 0,
                paymentStatus: order.paymentStatus === 'paid' ? 'Paid' : 'Pending',
                orderStatus: order.orderStatus || 'Processing',
                createdAt: order.createdAt
            };
        });

        console.log(`✅ [RESPONSE SENT] Successfully returning ${formattedOrders.length} populated orders to frontend.`);

        return res.status(200).json({
            success: true,
            orders: formattedOrders
        });

    } catch (error) {
        console.error("❌ [ERROR] Failed in getAllOrders controller:", error.message);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    console.log(`🛠️ [API HIT] PUT /updateorderstatus/${req.params.id} requested with status:`, req.body.orderStatus);
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!orderStatus) {
            console.log("⚠️ [WARNING] Missing orderStatus in request body.");
            return res.status(400).json({ success: false, message: "orderStatus is required in body" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            console.log(`⚠️ [WARNING] Order with ID ${id} not found in database.`);
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        console.log(`✅ [DB SUCCESS] Order ${updatedOrder._id} status successfully updated to: ${orderStatus}`);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            updatedOrder,
        });
    } catch (error) {
        console.error("❌ [ERROR] Failed in updateOrderStatus controller:", error.message);
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    getAllOrders,
    updateOrderStatus
};