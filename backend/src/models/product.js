import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    productPrice: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },

    productImage: {
        type: String,
        default: null
    }
}
    , { timestamps: true })

const Products = mongoose.model("Products", productSchema)

export default Products;
