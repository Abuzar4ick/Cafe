const express = require('express')
const app = express()
const mongo = require('./config/db')
const error = require('./middlewares/error')
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// connect to mongo
mongo()

// middlewares
app.use('/api',
    require('./routes/user.route'), 
    require('./routes/admin.route'),
    require('./routes/cashier.route'),
    require('./routes/chier.route')
)

// error
app.use(error)

// listen the server
const PORT = process.env.PORT || 3000
app.listen(PORT, err => {
    if (err) console.log(`Server listening error: ${err}`);
    console.log(`Server listening on port: ${PORT}`)
})