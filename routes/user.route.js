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

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: example@gmail.com
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: example@gmail.com
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           example: example@gmail.com
 *         otp:
 *           type: string
 *           example: 1234
 *     OrderRequest:
 *       type: object
 *       required:
 *         - orderId
 *         - payment
 *       properties:
 *         orderId:
 *           type: string
 *           example: 63f2b8b4c2f86e2e4c4d7a1d
 *         payment:
 *           type: string
 *           example: Card
 */

/**
 * @swagger
 * /register/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: User already exists.
 */

/**
 * @swagger
 * /register/login:
 *   post:
 *     summary: Log in user
 *     description: Logs in the user and sends an OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Validation error.
 */

/**
 * @swagger
 * /register/verify:
 *   post:
 *     summary: Verify user OTP
 *     description: Verifies the OTP sent to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: Account verified successfully.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Invalid OTP.
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       404:
 *         description: Dish not found.
 *   get:
 *     summary: Get all orders
 *     description: Fetches all orders (admin and chief only).
 *     responses:
 *       200:
 *         description: Orders fetched successfully.
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Fetches details of an order by its ID (admin and chief only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 63f2b8b4c2f86e2e4c4d7a1d
 *     responses:
 *       200:
 *         description: Order details fetched successfully.
 *       404:
 *         description: Order not found.
 *   delete:
 *     summary: Delete order by ID
 *     description: Deletes an order by its ID (admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 63f2b8b4c2f86e2e4c4d7a1d
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *       404:
 *         description: Order not found.
 *       400:
 *         description: Invalid ID format.
 */


module.exports = router