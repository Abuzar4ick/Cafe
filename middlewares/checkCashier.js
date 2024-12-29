const authModel = require('../models/auth.model')
const ErrorResponse = require('../utils/errorResponse')

const checkCashier = async (req, res, next) => {
    try {
        const cashierId = req.user.id
        const cashier = await authModel.findOne({ _id: cashierId })
        if (!cashier || cashier.role !== 'cashier') {
            return next(new ErrorResponse("You aren't cashier.", 400))
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkCashier