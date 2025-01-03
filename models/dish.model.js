const { Schema, model } = require('mongoose')

const dishSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: [String],
        default: "all"
    },
    img: {
        type: String,
        required: true
    },
    have: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Dish', dishSchema)