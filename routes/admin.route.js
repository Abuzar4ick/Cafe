const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middlewares/checkToken');
const checkAdmin = require('../middlewares/checkAdmin');
require('express-group-routes');
const {
    signIn,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    addNewDish,
    updateDish,
    deleteDish
} = require('../controllers/admin.controller');

/**
 * @swagger
 * /admin/register/sign-in:
 *   post:
 *     summary: Admin sign-in
 *     tags: [Admin]
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
 *     responses:
 *       200:
 *         description: Successful sign-in
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Unauthorized
 */
router.group('/admin/register', route => {
    route.post('/sign-in', [
        body('password')
            .notEmpty().withMessage('Password ni kiriting.'),
        body('email')
            .isEmail().withMessage("Iltimos, email ni to'g'ri kiriting.")
            .matches('@gmail.com$', 'i').withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: true,
                    errors: errors.array()
                });
            }
            next();
        }
    ], signIn);
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.group('/users', route => {
    route.get('/', authenticate, checkAdmin, getUsers);
    route.get('/:id', authenticate, checkAdmin, getUserById);
    route.delete('/:id', authenticate, checkAdmin, deleteUser);
    route.patch('/:id', authenticate, checkAdmin, updateUser);
});

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Add new dish to the menu
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dish added successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.group('/menu', route => {
    route.post('/', authenticate, checkAdmin, [
        // Validation for title, price, and category
        body('title')
            .notEmpty().withMessage("Iltimos, taom nomini kiriting."),
        body('price')
            .notEmpty().withMessage("Iltimos, taom narxini kiriting"),
        body('category')
            .isArray().withMessage('Category must be an array of strings.')
            .optional(),
        body('description')
            .isString().withMessage('Description must be a string.')
            .optional(),

        // Check for validation errors
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
    ], addNewDish);

    // Update and delete dish
    route.put('/:id', authenticate, checkAdmin, updateDish);
    route.delete('/:id', authenticate, checkAdmin, deleteDish);
});

module.exports = router;
