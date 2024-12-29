const orderModel = require('../models/order.model')
const asyncHandle = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')

// Router: /api/cashier/regiser/sign-in
exports.signIn = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body
    if (password !== process.env.CASHIER_PASS) {
        return next(new ErrorResponse("You aren't cashier.", 400))
    }

    const findCashier = await authModel.findOne({ email })
    if (!findCashier) {
        await authModel.create({
            username: "Cashier",
            email
        })
    }
    if (findAdmin.role !== 'cashier') await authModel.findOneAndUpdate({ email }, { role: 'cashier' }, { new: true });

    const token = findCashier.getJWT()
    await authModel.findOneAndUpdate({ email }, { isVerify: true }, { new: true })
    return res.status(200).json({
        success: true,
        message: "You are cashier.",
        token
    })
})

// Router: /api/paymets
exports.paymets = asyncHandle(async (req, res, next) => {
    const { id } = req.body
    const order = await orderModel.findOne({ _id: id })
    if (!order) return next("Order with this id not found.", 404);
    if (order.status === 'makin') {
        return next(new ErrorResponse("This order is makin.", 400))
    } else if (order.status === 'completed') {
        return next(new ErrorResponse("This order is already completed.", 400))
    }
    const completedOrder = await orderModel.findByIdAndUpdate(id, { status: "completed" })
    res.status(200).json({
        success: true,
        message: "The order was completed.",
        completedOrder
    })
})