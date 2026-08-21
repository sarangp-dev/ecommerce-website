import express from "express";
import controller from "../controllers/user.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
import { uploadProfilePhoto } from "../middleware/uploadProfilePhoto.js";

const router = express.Router();

router.post("/register", uploadProfilePhoto, controller.RegistrationController);
router.post("/login", controller.LoginController);
router.get("/me", authMiddleware, controller.getProfile); // for the /me endpoint we discussed

export default router;