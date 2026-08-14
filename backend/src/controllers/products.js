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
    addProduct, getAllProducts, editProduct, deleteProduct
};