const { Router } = require('express');
const router = Router();
const { authenticate } = require('../middlewares/checkToken');
const checkCashier = require('../middlewares/checkCashier');
const { payments, signIn } = require('../controllers/cashier.controller');
require('express-group-routes');

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Make a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order being paid for
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount to be paid
 *               paymentMethod:
 *                 type: string
 *                 description: The method used for payment (e.g., credit card, cash)
 *     responses:
 *       200:
 *         description: Payment successfully processed
 *       400:
 *         description: Invalid payment details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access
 */
router.group('/payments', route => {
    route.post('/', authenticate, checkCashier, payments);
});

/**
 * @swagger
 * /api/cashier/register/signin:
 *   post:
 *     summary: Sign in for Cashier
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful sign-in
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.group('/cashier/register', route => {
    route.post('/signin', signIn);
});

module.exports = router;
