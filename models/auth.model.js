const { Schema, model } = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'admin', 'cashier', 'chief', 'waiter'],
        default: 'client'
    },
    balance: {
        type: Number,
        default: null
    },
    isVerify: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// JWT token
userSchema.methods.getJWT = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = model('User', userSchema)