const authModel = require('../models/auth.model')
const orderModel = require('../models/order.model')
const dishModel = require('../models/dish.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const mailService = require('../service/main.service')
const mongoose = require('mongoose')

// Router: /api/register/signup
exports.signup = asyncHandle(async (req, res, next) => {
    const { username, email } = req.body
    const findUser = await authModel.findOne({ email })
    if (findUser) return next(new ErrorResponse("This user already exist.", 401));

    const newUser = await authModel.create({
        username,
        email
    })
    res.status(201).json({
        sucess: true,
        newUser
    })
})

// Router: /api/register/login
exports.login = asyncHandle(async (req, res, next) => {
    const { email } = req.body
    const existUser = await authModel.findOne({ email })
    if (!existUser) return next(new ErrorResponse("Account with this email is not found", 404));
    await mailService.sendOtp(email)
    res.status(200).json({
        success: true,
        user: existUser
    })
})

// Router: /api/register/verify
exports.verify = asyncHandle(async (req, res, next) => {
    const { email, otp } = req.body
    const verifyResult = await mailService.verifyOtp(email, otp)
    if (!verifyResult.success) return res.status(400).json({ success: false, message: verifyResult.message })
    const user = await authModel.findOne({ email })

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const token = user.getJWT()
    await authModel.findOneAndUpdate({ email }, { isVerify: true }, { new: true })
    return res.status(200).json({
        success: true,
        message: "You have successfully verified your account.",
        user,
        token
    })
})

// Router: /api/register/logout
exports.logout = asyncHandle(async (req, res, next) => {
    const email = req.user.email
    const findAuth = await authModel.findOne({ email })
    if (!findAuth) return next(new ErrorResponse('User not found.', 404));
    const updatedAuth = await authModel.findOneAndUpdate(email, { isVerify: false }, { new: true })
    res.status(200).json({
        success: true,
        message: "You have successfully logged out.",
        updatedAuth
    })
})

// <-----------------------------------------------------------------------------> //

// Router: /api/orders
exports.newOrder = asyncHandle(async (req, res, next) => {
    const clientId = req.user.id
    const { orderId, paymet } = req.body
    const findedDish = await dishModel.findById(orderId)
    if (!findedDish) return next(new ErrorResponse("Dish with this id not found.", 404));

    const order = await orderModel.create({
        clientId,
        dishId: findedDish._id,
        price: findedDish.price,
        paymet // Carta yoki Nalichka
    })
    res.status(201).json({
        success: true,
        newOrder: order
    })
})

// Router: /api/orders
// For: admin && chief
exports.getOrders = asyncHandle(async (req, res, next) => {
    const orders = await orderModel.find()
    res.status(200).json({
        success: true,
        data: orders
    })
})

// Router: /api/orders/:id
// For: admin && chief
exports.getOrderById = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    const order = await orderModel.findById(id)
    if (!order) return next(new ErrorResponse("Order with this id not found.", 404));
    res.status(200).json({
        success: true,
        order
    })
})

// Router: /api/orders/:id
// For: admin
exports.deleteOrder = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));
    const deletedOrder = await orderModel.findByIdAndDelete(id)
    if (!deletedOrder) return next(new ErrorResponse("Order with this id not found.", 404));
    res.status(200).json({
        success: true,
        message: "Order successfuly deleted.",
        deletedOrder
    })
})