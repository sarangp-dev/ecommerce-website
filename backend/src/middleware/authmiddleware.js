import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    console.log("Auth middleware called. Request headers:", req.headers);
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }
    next();
};
export { authMiddleware, adminOnly };