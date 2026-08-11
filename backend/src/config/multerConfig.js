const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("./cloudinary.js");
const { cloudinaryStorage } = require("multer-storage-cloudinary");
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "uploads",
    allowedFormats: ["jpg", "png"]
});
const upload = multer({ storage: storage });