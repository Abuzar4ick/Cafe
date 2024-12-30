const { Router } = require('express');
const router = Router();
const { authenticate } = require('../middlewares/checkToken');
const checkCashier = require('../middlewares/checkCashier');
const { payments, signIn } = require('../controllers/cashier.controller');
require('express-group-routes');

router.group('/payments', route => {
    route.post('/', authenticate, checkCashier, payments);
});

router.group('/cashier/register', route => {
    route.post('/signin', signIn);
});

module.exports = router;