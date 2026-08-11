// middleware/uploadProfilePhoto.js

import multer from "multer";

const uploadProfilePhoto = (req, res, next) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },

        filename: function (req, file, cb) {
            cb(
                null,
                Date.now() + "-" + file.originalname
            );
        }
    });

    const upload = multer({
        storage: storage
    }).single("profilePhoto");

    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            console.error("Multer error:", err);

            return res.status(400).json({
                message: "Multer error occurred",
                error: err.message
            });
        }

        if (err) {
            console.error("Upload error:", err);

            return res.status(500).json({
                message: "Server error",
                error: err.message
            });
        }

        console.log("Uploaded file:", req.file);

        next();
    });
};

export { uploadProfilePhoto };