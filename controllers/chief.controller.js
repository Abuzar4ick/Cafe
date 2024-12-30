const mongoose = require('mongoose')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const authModel = require('../models/auth.model')
const orderModel = require('../models/order.model')

// Router: /api/chief/register/signin
exports.signIn = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body
    if (password !== process.env.CHIEF_PASS) return next(new ErrorResponse("You aren't chief.", 400));
 
    let chief = await authModel.findOne({ email })
    if (!chief) {
        chief = await authModel.create({
            email,
            username: "Chief",
            role: 'chief',
            isVerify: true
        })
    } else if (chief.role !== 'chief') {
        chief = await authModel.findOneAndUpdate(
            { email },
            { role: 'chief', isVerify: true },
            { new: true }
        )
    } else {
        return next(new ErrorResponse("You are already chief.", 401))
    }

    const token = chief.getJWT();
    return res.status(200).json({
        success: true,
        message: "You are chief.",
        token
    })
})

// Router: /api/orders/:id
// For: chief
exports.updateOrderStatus = asyncHandle(async (req, res, next) => {
    const { id } = req.params
    const { newStatus } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));
    if (!['making', 'completed', 'cancelled'].includes(newStatus)) return next(new ErrorResponse("Invalid status value.", 400));
    const order = await orderModel.findByIdAndUpdate(
        id,
        { status: newStatus },
        { new: true }
    )
    if (!order) {
        return next(new ErrorResponse("Order with this id not found.", 404))
    }
    res.status(200).json({
        success: true,
        message: "Order successfully updated.",
        order
    })
})