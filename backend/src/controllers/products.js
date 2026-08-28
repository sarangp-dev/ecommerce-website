import Products from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";
import Order from "../models/payment.js";
// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentWithStripe = async (req, res) => {
    try {
        console.log("Stripe payment request:", req.body);

        const { items, userId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const lineItems = [];
        const orderItems = [];

        let totalAmount = 0;

        for (const item of items) {

            const productId = item.product || item.id;

            const product = await Products.findById(productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quantity",
                });
            }

            // Check stock
            if (product.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${product.productName} has only ${product.quantity} items available`,
                });
            }

            const price = Number(product.productPrice);

            totalAmount += price * quantity;

            // Stripe item
            lineItems.push({
                price_data: {
                    currency: "inr",

                    product_data: {
                        name: product.productName,
                    },

                    unit_amount: Math.round(price * 100),
                },

                quantity: quantity,
            });

            // Save this information for webhook
            orderItems.push({
                product: product._id.toString(),
                name: product.productName,
                quantity: quantity,
                price: price,
            });
        }

        // Add your delivery fee
        const deliveryFee = 15;

        totalAmount += deliveryFee;

        // Add delivery fee to Stripe
        lineItems.push({
            price_data: {
                currency: "inr",

                product_data: {
                    name: "Delivery Fee",
                },

                unit_amount: deliveryFee * 100,
            },

            quantity: 1,
        });

        // Create Stripe checkout
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,

            mode: "payment",

            metadata: {
                userId: userId || "",
                items: JSON.stringify(orderItems),
                amount: totalAmount.toString(),
            },

            success_url:
                "https://yuthi-ecommerce.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",

            cancel_url:
                "https://yuthi-ecommerce.vercel.app/payment-cancel",
        });

        console.log(
            "Stripe session created:",
            session.id
        );

        return res.status(200).json({
            success: true,
            url: session.url,
        });

    } catch (error) {

        console.error("Stripe error:", error);

        return res.status(500).json({
            success: false,
            message: "Stripe payment failed",
            error: error.message,
        });
    }
};


const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error(
            "Webhook verification failed:",
            error.message
        );

        return res.status(400).send(
            `Webhook Error: ${error.message}`
        );
    }

    try {

        if (event.type === "checkout.session.completed") {

            const session = event.data.object;

            console.log(
                "Payment successful:",
                session.id
            );

            // Prevent duplicate orders
            const existingOrder = await Order.findOne({
                stripePaymentId: session.id,
            });

            if (existingOrder) {
                console.log("Order already exists");
                return res.status(200).json({
                    received: true,
                });
            }

            // Get information from Stripe metadata
            const items = JSON.parse(
                session.metadata.items
            );

            const amount = Number(
                session.metadata.amount
            );

            const userId =
                session.metadata.userId || undefined;

            // Create order
            const order = await Order.create({
                user: userId,

                items: items,

                amount: amount,

                paymentStatus: "paid",

                stripePaymentId: session.id,
            });

            console.log(
                "Order saved:",
                order._id
            );

            // Reduce stock
            for (const item of items) {

                await Products.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            quantity: -item.quantity,
                        },
                    }
                );
            }

            console.log("Stock updated");
        }

        return res.status(200).json({
            received: true,
        });

    } catch (error) {

        console.error(
            "Webhook error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
};

const verifyPaymentSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        // Retrieve the session straight from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session && session.payment_status === "paid") {
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Payment is not completed yet" });
        }
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Make sure to export verifyPaymentSession along with your other controller functions!

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "yuthi/products",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};

const addProduct = async (req, res) => {
    try {
        console.log("Adding product:", req.body);

        const {
            productName,
            productprice,
            quantity,
            description,
            category,
        } = req.body;

        // Validate required fields
        if (!productName || !productprice || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product name, price and quantity are required",
            });
        }

        let imageUrl = null;

        // Upload image
        if (req.file) {
            console.log("Uploading image to Cloudinary...");

            const result = await uploadToCloudinary(req.file.buffer);

            imageUrl = result.secure_url;

            console.log("Cloudinary upload complete", "Image URL:", imageUrl);
        }

        // Save product
        const newProduct = await Products.create({
            productName,
            category,
            productPrice: Number(productprice),
            quantity: Number(quantity),
            description,
            productImage: imageUrl,
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            newProduct,
        });

    } catch (error) {
        console.error("Product creation error:", error);

        return res.status(500).json({
            success: false,
            message: "Product adding failed",
            error: error.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
            });
        }

        const formattedProducts = products.map((product) => ({
            id: product._id,
            name: product.productName,
            price: product.productPrice || 0,
            image: product.productImage,
            category: "Products",
            description: `Only ${product.quantity} items available`,
            tag: product.quantity > 0 ? "AVAILABLE" : "OUT OF STOCK",
        }));

        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            products: formattedProducts,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving products",
            error: err.message,
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Editing product ID:", id);
        console.log("Update data:", req.body);

        const {
            productName,
            productprice,
            quantity,
            description,
            category,
        } = req.body;

        // Check if the product exists
        const existingProduct = await Products.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let imageUrl = existingProduct.productImage;

        // If a new file is uploaded, upload it to Cloudinary
        if (req.file) {
            console.log("Uploading new image to Cloudinary...");
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
            console.log("New Cloudinary upload complete. Image URL:", imageUrl);

            // Optional: You can write code here to delete the old image from Cloudinary 
            // using existingProduct.productImage if you want to clean up storage.
        }

        // Prepare update data (only update fields provided or fallback to existing)
        const updatedData = {
            productName: productName || existingProduct.productName,
            category: category || existingProduct.category,
            productPrice: productprice !== undefined ? Number(productprice) : existingProduct.productPrice,
            quantity: quantity !== undefined ? Number(quantity) : existingProduct.quantity,
            description: description !== undefined ? description : existingProduct.description,
            productImage: imageUrl,
        };

        // Update the product in the database
        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct,
        });

    } catch (error) {
        console.error("Product update error:", error);

        return res.status(500).json({
            success: false,
            message: "Product updating failed",
            error: error.message,
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting product ID:", id);

        // Find the product first to check if it exists and get the image URL
        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Optional: Delete the image from Cloudinary if it exists
        if (product.productImage) {
            try {
                // Extract public ID from Cloudinary URL to delete it
                // Example URL: https://res.cloudinary.com/.../upload/v12345678/yuthi/products/xyz.jpg
                const urlParts = product.productImage.split('/');
                const uploadIndex = urlParts.indexOf('upload');

                if (uploadIndex !== -1) {
                    // Get everything after 'upload/vXXXXX/'
                    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
                    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

                    console.log("Deleting image from Cloudinary, Public ID:", publicId);
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError);
                // Continue with product deletion even if cloud image deletion fails
            }
        }

        // Delete the product from the database
        await Products.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error("Product deletion error:", error);

        return res.status(500).json({
            success: false,
            message: "Product deletion failed",
            error: error.message,
        });
    }
};

export default {
    addProduct,
    getAllProducts,
    editProduct,
    deleteProduct,
    paymentWithStripe,
    stripeWebhook,
    verifyPaymentSession
};