const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/auth.model");
require("dotenv").config();

exports.authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Tokenni olish
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Agar token mavjud bo'lmasa
    if (!token) {
        return next(new ErrorResponse("No token provided", 401));
    }

    try {
        // Tokenni tekshirish
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        // Agar token decoding ishlamasa
        if (!decoded || !decoded.id) {
            return next(new ErrorResponse("Invalid token data", 400));
        }

        // Foydalanuvchini topish
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse("No user found with this token", 404));
        }

        // `req.user`ga foydalanuvchi ma'lumotlarini qo'shish
        req.user = user;
        next();
    } catch (error) {
        console.error(error); // Xatolikni batafsil tekshirish
        return next(new ErrorResponse("Invalid token or token expired", 401));
    }
});
