const authModel = require('../models/auth.model')
const ErrorResponse = require('../utils/errorResponse')

const checkChief = async (req, res, next) => {
    try {
        const chiefId = req.user.id
        const chief = await authModel.findOne({ _id: chiefId })
        if (!chief || chief.role !== 'chief' && chief.role !== 'admin') {
            return next(new ErrorResponse("You aren't chief.", 400))
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkChief