const { Router } = require('express')
const router = Router()
const { authenticate } = require('../middlewares/checkToken')
const { body, validationResult } = require('express-validator')
const checkChief = require('../middlewares/checkChief')
const checkAdmin = require('../middlewares/checkAdmin')
const {
    signup,
    login,
    verify,
    newOrder,
    getOrders,
    getOrderById,
    deleteOrder
} = require('../controllers/user.controller')
const { getMenu, getDishById } = require('../controllers/admin.controller')
require('express-group-routes')

router.group('/register', route => {
    // POST methods
    route.post('/signup', [
        body('username')
            .isLength({ max: 50 }).withMessage("Qisqaroq ism kiriting.")
            .isLength({ min: 2 }).withMessage("Uzunroq ism kiriting."),
        body('email')
            .isEmail().withMessage("Iltimos, email ni to'g'ri kiriting.")
            .matches('@gmail.com$', 'i').withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }
            next();
        }
    ], signup);

    route.post('/login', [
        body('email')
            .isEmail().withMessage("Iltimos, email ni to'g'ri kiriting.")
            .matches('@gmail.com$', 'i').withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                })
            }
            next()
        }
    ], login)

    route.post('/verify', [
        body('email')
            .isEmail().withMessage("Iltimos, email ni to'g'ri kiriting.")
            .matches('@gmail.com$', 'i').withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
        body('otp')
            .isLength({ min: 4 }).withMessage("OTP ni to'liq kiriting.")
            .isLength({ max: 4 }).withMessage("OTP ni to'liq kiriting."),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                })
            }
            next()
        }
    ], verify)
})

router.get('/menu', authenticate, getMenu)
router.get('/menu/:id', authenticate, getDishById)

router.group('/orders', route => {
    route.post('/', authenticate, newOrder)
    route.get('/', authenticate, checkChief, getOrders)
    route.get('/:id', authenticate, getOrderById)
    route.delete('/:id', authenticate, checkAdmin, deleteOrder)
})

module.exports = router