import Products from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";

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

export default {
    addProduct,
};