const { Router } = require('express')
const router = Router()
const { authenticate } = require('../middlewares/checkToken')
const checkCashier = require('../middlewares/checkCashier')
const {
    paymets,
    signIn
} = require('../controllers/cashier.controller')
require('express-group-routes')

router.group('/paymets', route => {
    route.post('/', authenticate, checkCashier, paymets)
})

router.group('/cashier/register', route => {
    route.post('/signin', signIn)
})

module.exports = router