const orderModel = require('../models/order.model');
const authModel = require('../models/auth.model'); // Import yetishmayotgan model
const asyncHandle = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Router: /api/cashier/register/sign-in
exports.signIn = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body

    if (password !== process.env.CASHIER_PASS) return next(new ErrorResponse("You aren't cashier.", 400));
    let cashier = await authModel.findOne({ email })
    if (!cashier) {
        cashier = await authModel.create({
            username: "Cashier",
            email,
            role: 'cashier',
        })
    } else if (cashier.role !== 'cashier') {
        cashier = await authModel.findOneAndUpdate(
            { email },
            { role: 'cashier' },
            { new: true }
        )
    }

    cashier.isVerify = true
    await cashier.save()
    const token = cashier.getJWT()

    return res.status(200).json({
        success: true,
        message: "You are cashier.",
        token
    })
})

// Router: /api/payments
exports.paymets = asyncHandle(async (req, res, next) => {
    const { id } = req.body
    const order = await orderModel.findById(id)
    if (!order) return next(new ErrorResponse("Order with this ID not found.", 404));
    if (order.status === 'making') return next(new ErrorResponse("This order is makin.", 400));
    if (order.status === 'completed') return next(new ErrorResponse("This order is already completed.", 400));
    const completedOrder = await orderModel.findByIdAndUpdate(
        id,
        { status: "completed" },
        { new: true } 
    )

    res.status(200).json({
        success: true,
        message: "The order was completed.",
        completedOrder
    })
})