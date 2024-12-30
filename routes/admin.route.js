const { Router } = require('express')
const router = Router()
const { body, validationResult } = require('express-validator')
const { authenticate } = require('../middlewares/checkToken')
const checkAdmin = require('../middlewares/checkAdmin')
require('express-group-routes')
const {
    signIn,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
// <--------------> //
    addNewDish,
    getDishById,
    updateDish,
    deleteDish
} = require('../controllers/admin.controller')

router.group('/admin/register', route => {
    // POST methods
    route.post('/sign-in', [
        body('password')
            .notEmpty().withMessage('Password ni kiriting.'),
        body('email')
            .isEmail().withMessage("Iltimos, email ni to'g'ri kiriting.")
            .matches('@gmail.com$', 'i').withMessage("Iltimos, faqat @gmail.com manzillarini kiriting."),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    sucess: true,
                    errors: errors.array()
                })
            }
            next()
        }
    ], signIn)
})

router.group('/users', route => {
    // GET methods
    route.get('/', authenticate, checkAdmin, getUsers)
    route.get('/:id', authenticate, checkAdmin, getUserById)
    // DELETE methods
    route.delete('/:id', authenticate, checkAdmin, deleteUser)
    // PATCH methods
    route.patch('/:id', authenticate, checkAdmin, updateUser)
})

router.group('/menu', route => {
    // POST methods
    route.post('/', authenticate, checkAdmin, [
        body('title')
            .notEmpty().withMessage("Iltimos, taom nomini kiriting."),
        body('price')
            .notEmpty().withMessage("Iltimos, taom narxini kiriting"),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    sucess: true,
                    errors: errors.array()
                })
            }
            next()
        }
    ], addNewDish)
    // PUT methods
    route.put('/:id', authenticate, checkAdmin, updateDish)
    // DELETE methods
    route.delete('/:id', authenticate, checkAdmin, deleteDish)
})

module.exports = router