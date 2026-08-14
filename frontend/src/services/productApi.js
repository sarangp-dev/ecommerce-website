// productApi.js


import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);

        return response.data;

    } catch (error) {
        console.error("Error fetching products:", error);

        throw new Error(
            error.response?.data?.message ||
            "Failed to fetch products"
        );
    }
};