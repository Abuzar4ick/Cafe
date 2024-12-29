const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const authModel = require('../models/auth.model')
const dishModel = require('../models/dish.model')
const mongoose = require('mongoose')

// Router: /api/admin/register/sign-in
exports.signIn = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body
    if (password !== process.env.ADMIN_PASS) {
        return next(new ErrorResponse("You aren't admin.", 400))
    }

    const findAdmin = await authModel.findOne({ email })
    if (!findAdmin) {
        return next(new ErrorResponse("Admin not found.", 404))
    }
    if (findAdmin.role !== 'admin') {
        await authModel.findOneAndUpdate({ email }, { role: 'admin' }, { new: true })
    }

    const token = findAdmin.getJWT()
    await authModel.findOneAndUpdate({ email }, { isVerify: true }, { new: true })
    return res.status(200).json({
        success: true,
        message: "You are admin.",
        token
    })
})

// Router: /api/users
exports.getUsers = asyncHandle(async (req, res, next) => {
    const users = await authModel.find({ role: 'client' })
    res.status(200).json({
        success: true,
        data: users
    })
})

// Router: /api/users/:id
exports.getUserById = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));

    const user = await authModel.findById(id)
    if (!user) return next(new ErrorResponse("User with this id not found.", 404));

    res.status(200).json({
        success: true,
        clients: user
    })
})

// Router: /api/users/:id
exports.deleteUser = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));

    const deletedUser = await authModel.findByIdAndDelete(id)
    if (!deletedUser) return next(new ErrorResponse("User with this id not found.", 404));

    res.status(200).json({
        success: true,
        message: "User was deleted.",
        deletedUser
    })
})

// Router: /api/users/:id
exports.updateUser = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));

    const { username, email } = req.body
    const updatedUser = await authModel.findByIdAndUpdate(id, { username, email }, { new: true })
    if (!updatedUser) return next(new ErrorResponse("User with this id not found.", 404));

    res.status(200).json({
        success: true,
        updatedUser
    })
})

// <-----------------------------------------------------------------------------> //

// Router: /api/menu
exports.addNewDish = asyncHandle(async (req, res, next) => {
    const { title, price, category } = req.body
    const dish = await dishModel.create({ title, price, category })
    res.status(201).json({
        success: true,
        newDish: dish
    })
})

// Router: /api/menu
exports.getMenu = asyncHandle(async (req, res, next) => {
    const allMenu = await dishModel.find()
    res.status(200).json({
        success: true,
        data: allMenu
    })
})

// Router: /api/menu/:id
exports.getDishById = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));

    const findedDish = await dishModel.findById(id)
    if (!findedDish) return next(new ErrorResponse("User with this id not found.", 404));
    res.status(200).json({
        success: true,
        findedDish
    })
})

// Router: /api/menu/:id
exports.updateDish = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));
    const { title, price, category } = req.body
    const updatedDish = await dishModel.findByIdAndUpdate(id, { title, price, category }, { new: true })
    if (!updatedDish) return next(new ErrorResponse("User with this id not found.", 404));
    res.status(200).json({
        success: true,
        updatedDish
    })
})

// Router: /api/menu/:id
exports.deleteDish = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));
    const deletedDish = await dishModel.findByIdAndDelete(id)
    if (!deletedDish) return next(new ErrorResponse("User with this id not found.", 404));
    res.status(200).json({
        success: true,
        message: "Dish was deleted.",
        deletedDish
    })
})