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
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       balance:
 *                         type: number
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.group('/users', route => {
    route.get('/', authenticate, checkAdmin, getUsers);
    
    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get a user by ID
     *     tags: [Users]
     *     parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successfully retrieved the user
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     username:
     *                       type: string
     *                     email:
     *                       type: string
     *                     role:
     *                       type: string
     *                     balance:
     *                       type: number
     *                       nullable: true
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *       401:
     *         description: Unauthorized
     */
    route.get('/:id', authenticate, checkAdmin, getUserById);

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successfully deleted the user
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     */
    route.delete('/:id', authenticate, checkAdmin, deleteUser);

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Update a user by ID
     *     tags: [Users]
     *     parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               role:
     *                 type: string
     *               balance:
     *                 type: number
     *     responses:
     *       200:
     *         description: Successfully updated the user
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     */
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

    route.put('/:id', authenticate, checkAdmin, updateDish);
    route.delete('/:id', authenticate, checkAdmin, deleteDish);
});

module.exports = router;
