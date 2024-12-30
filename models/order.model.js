const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dishId: {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
    },
    status: {
        type: String,
        enum: ['making', 'ready', 'completed'],
        default: 'making'
    },
    price: {
        type: Number,
        required: true
    },
    paymet: {
        type: String,
        enum: ["Cash", "Card"],
    }
}, {
    timestamps: true
})

module.exports = model('Order', orderSchema)