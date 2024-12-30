const { Router } = require('express');
const router = Router();
const { updateOrderStatus, signIn } = require('../controllers/chief.controller');
const { authenticate } = require('../middlewares/checkToken');
const checkChief = require('../middlewares/checkChief');
require('express-group-routes');

/**
 * @swagger
 * /api/chief/register/signin:
 *   post:
 *     summary: Sign in for Chief
 *     tags: [Chief]
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
router.group('/chief/register', (route) => {
    route.post('/signin', signIn);
});

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *                 description: The new status of the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.group('/orders', (route) => {
    route.patch('/:id', authenticate, checkChief, updateOrderStatus);
});

module.exports = router;
