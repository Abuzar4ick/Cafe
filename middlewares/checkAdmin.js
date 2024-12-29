const authModel = require('../models/auth.model')
const ErrorResponse = require('../utils/errorResponse')

const checkAdmin = async (req, res, next) => {
    try {
        const adminId = req.user.id
        const admin = await authModel.findOne({ _id: adminId })
        if (!admin || admin.role !== 'admin') {
            return next(new ErrorResponse("You aren't admin.", 400))
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkAdmin