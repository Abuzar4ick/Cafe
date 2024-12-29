const ErrorResponse = require('../utils/errorResponse')
const asyncHandle = require('../middlewares/async')
const authModel = require('../models/auth.model')

// Router: /api/chief/register/signin
exports.signIn = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body
    if (password !== process.env.CHIEF_PASS) {
        return next(new ErrorResponse("You aren't chief.", 400))
    }

    const findChief = await authModel.findOne({ email })
    if (!findChief) {
        return next(new ErrorResponse("Chief not found.", 404))
    }
    if (findChief.role !== 'chief') {
        await authModel.findOneAndUpdate({ email }, { role: 'chief' }, { new: true })
    }

    const token = findChief.getJWT()
    await authModel.findOneAndUpdate({ email }, { isVerify: true }, { new: true })
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
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorResponse("Invalid ID format.", 400));
    const { newStatus } = req.body
    const order = await orderModel.findByIdAndUpdate(id, { status: newStatus }, { new: true })
    if (!order) return next(new ErrorResponse("Order with this id not found.", 404));
    res.status(200).json({
        success: true,
        message: "Order successfuly updated.",
        order
    })
})