const { Router } = require('express')
const router = Router()
const { updateOrderStatus, signIn } = require('../controllers/chief.controller')
const { authenticate } = require('../middlewares/checkToken')
const checkChief = require('../middlewares/checkChief')
require('express-group-routes')

router.group('/chief/register', (route) => {
    route.post('/signin', signIn)
})

router.group('/orders', (route) => {
    route.patch('/:id', authenticate, checkChief, updateOrderStatus)
})

module.exports = router