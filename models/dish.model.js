const { Schema, model } = require('mongoose');

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
        default: ['all'],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: 'At least one category is required'
        }
    },
    img: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?([a-z0-9]+[.-_])*[a-z0-9]+\.[a-z]{2,}(\/.*)?$/i.test(v);
            },
            message: 'Invalid image URL'
        }
    },
    have: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default: ''
    }
});

module.exports = model('Dish', dishSchema);