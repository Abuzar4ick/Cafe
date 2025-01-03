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
        default: ['all'],  // Bir nechta kategoriyalarni qo'llash uchun
        required: true
    },
    img: {
        type: String,
        required: true   // Rasmni saqlash uchun string (yoki path)
    },
    have: {
        type: Boolean,
        default: true
    },
    description: {  // Agar taomni tasvirlash uchun qo'shimcha xususiyat kerak bo'lsa
        type: String,
        default: ''
    }
});

module.exports = model('Dish', dishSchema);
