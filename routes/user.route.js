const { Router } = require('express');
const router = Router();
const { authenticate } = require('../middlewares/checkToken');
const { body, validationResult } = require('express-validator');
const checkChief = require('../middlewares/checkChief');
const checkAdmin = require('../middlewares/checkAdmin');
const {
    signup,
    login,
    verify,
    newOrder,
    getOrders,
    getOrderById,
    deleteOrder
} = require('../controllers/user.controller');
const { getMenu, getDishById } = require('../controllers/admin.controller');
require('express-group-routes');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

/**
 * @swagger
 * path:
 *  /register/signup:
 *    post:
 *      summary: Register a new user
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  description: User's name
 *                  example: JohnDoe
 *                email:
 *                  type: string
 *                  description: User's email
 *                  example: john.doe@gmail.com
 *      responses:
 *        200:
 *          description: User successfully registered
 *        400:
 *          description: Invalid input
 */
router.group('/register', route => {
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

    /**
     * @swagger
     * path:
     *  /register/login:
     *    post:
     *      summary: Login user
     *      tags: [Authentication]
     *      requestBody:
     *        required: true
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                email:
     *                  type: string
     *                  description: User's email
     *                  example: john.doe@gmail.com
     *      responses:
     *        200:
     *          description: User successfully logged in
     *        400:
     *          description: Invalid input
     */
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
    ], login);

    /**
     * @swagger
     * path:
     *  /register/verify:
     *    post:
     *      summary: Verify user email with OTP
     *      tags: [Authentication]
     *      requestBody:
     *        required: true
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                email:
     *                  type: string
     *                  description: User's email
     *                  example: john.doe@gmail.com
     *                otp:
     *                  type: string
     *                  description: OTP for verification
     *                  example: '1234'
     *      responses:
     *        200:
     *          description: OTP verified successfully
     *        400:
     *          description: Invalid OTP or email
     */
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

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Get menu and dish information
 */

/**
 * @swagger
 * path:
 *  /menu:
 *    get:
 *      summary: Get all menu items
 *      tags: [Menu]
 *      responses:
 *        200:
 *          description: List of menu items
 */
router.get('/menu', authenticate, getMenu)

/**
 * @swagger
 * path:
 *  /menu/{id}:
 *    get:
 *      summary: Get a dish by ID
 *      tags: [Menu]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: The ID of the dish
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Dish found
 *        404:
 *          description: Dish not found
 */
router.get('/menu/:id', authenticate, getDishById)

router.group('/orders', route => {
    /**
     * @swagger
     * path:
     *  /orders:
     *    post:
     *      summary: Create a new order
     *      tags: [Orders]
     *      responses:
     *        200:
     *          description: Order created successfully
     *        400:
     *          description: Invalid input
     */
    route.post('/', authenticate, newOrder)

    /**
     * @swagger
     * path:
     *  /orders:
     *    get:
     *      summary: Get all orders
     *      tags: [Orders]
     *      responses:
     *        200:
     *          description: List of orders
     */
    route.get('/', authenticate, checkChief, getOrders)

    /**
     * @swagger
     * path:
     *  /orders/{id}:
     *    get:
     *      summary: Get order by ID
     *      tags: [Orders]
     *      parameters:
     *        - in: path
     *          name: id
     *          required: true
     *          description: The ID of the order
     *          schema:
     *            type: integer
     *      responses:
     *        200:
     *          description: Order found
     *        404:
     *          description: Order not found
     */
    route.get('/:id', authenticate, getOrderById)

    /**
     * @swagger
     * path:
     *  /orders/{id}:
     *    delete:
     *      summary: Delete an order by ID
     *      tags: [Orders]
     *      parameters:
     *        - in: path
     *          name: id
     *          required: true
     *          description: The ID of the order to delete
     *          schema:
     *            type: integer
     *      responses:
     *        200:
     *          description: Order deleted successfully
     *        404:
     *          description: Order not found
     */
    route.delete('/:id', authenticate, checkAdmin, deleteOrder)
})

module.exports = router