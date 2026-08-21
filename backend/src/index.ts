import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user-route.js";

import productRoutes from "./routes/product-route.js";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import cookieParser from "cookie-parser";

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map(origin => origin.trim());
dotenv.config();

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use('/uploads', express.static('uploads'));

app.get("/", (req: Request, res: Response) => {
    res.send("MERN TypeScript Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});