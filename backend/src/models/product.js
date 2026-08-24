import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },

        productPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        category: {
            type: String,
            default: "Products",
            trim: true,
        },

        productImage: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Products = mongoose.model("Products", productSchema);

export default Products;