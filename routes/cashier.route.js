const { Router } = require('express')
const router = Router()
const { authenticate } = require('../middlewares/checkToken')
const checkCashier = require('../middlewares/checkCashier')
const {
    paymets,
    signIn
} = require('../controllers/chief.controller')
require('express-group-routes')

router.group('/paymets', route => {
    route.post('/', authenticate, checkCashier, paymets)
})

router.group('/cashier/regiser', route => {
    route.post('/signin', signIn)
})

module.exports = router