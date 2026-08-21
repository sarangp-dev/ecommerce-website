import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from "../config/cloudinary.js";
const RegistrationController = async (req, res) => {
    console.log("RegistrationController called with body:", req.body);
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 12)
        let imageUrl = null;
        if (req.file) {
            console.log("Starting Cloudinary upload...");
            console.log("File path:", req.file.path);
            console.log("Testing Cloudinary connection...");

            const pingResult = await cloudinary.api.ping();

            console.log("Cloudinary ping result:", pingResult);
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "yuthi",
                    use_filename: true,
                    resource_type: "image",
                    timeout: 60000
                }
            );

            console.log("Cloudinary upload successful!");
            console.log("Cloudinary public_id:", result.public_id);
            console.log("Cloudinary URL:", result.secure_url);

            imageUrl = result.secure_url;
        }
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedpassword,
            profileImage: imageUrl
        });

        return res.status(200).json({
            success: true,
            message: "Registration successful",
        });
        console.log("New user created:", newUser);
    } catch (cloudinaryError) {

        console.error("========== CLOUDINARY ERROR ==========");
        console.error(cloudinaryError);
        console.error("======================================");

        return res.status(500).json({
            success: false,
            message: "Cloudinary upload failed",
            error: cloudinaryError instanceof Error
                ? cloudinaryError.message
                : String(cloudinaryError)
        });
    }
};
const LoginController = async (req, res) => {
    console.log("LoginController called with body:");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const UserEmail = email
        const user = await User.findOne({ email: UserEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        user.password = undefined; // strip before sending

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });

    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.log("error:", message)
        return res.status(500).json({
            message: "Login failed",
            error: message
        });
    }
};
// const LoginController = async (req, res) => {
//     console.log("LoginController called with body:", req.body);

//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "Email and password are required"
//             });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid email or password"
//             });
//         }

//         const passwordMatch = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!passwordMatch) {
//             return res.status(401).json({
//                 message: "Invalid email or password"
//             });
//         }

//         if (!process.env.JWT_SECRET) {
//             throw new Error("JWT_SECRET is missing");
//         }

//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "30d"
//             }
//         );

//         console.log("Generated JWT token:", token);

//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token
//         });

//     } catch (err) {

//         const message =
//             err instanceof Error
//                 ? err.message
//                 : "Unknown error";

//         return res.status(500).json({
//             message: "Login failed",
//             error: message
//         });
//     }
// };
const getProfile = async (req, res) => {
    try {
        const email = req.user.email;
        if (!email) {
            console.log("user email not founded")
        }
        const user = await User.findOne({
            email

        });
        if (user) {
            const profileData = {
                Dp: user.profileImage,
                Name: user.username,
                Email: user.email


            }
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });
    }
    catch (err) {
        console.log("error in profile getting")
    }
}


export default { RegistrationController, LoginController, getProfile };

