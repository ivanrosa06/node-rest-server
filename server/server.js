const express = require('express')
    // Using Node.js `require()`
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')
require('./config/config')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(require('./routes/usuario'))


mongoose.connect(process.env.URLDB, { userNewUrlParser: true, useCreateIndex: true },
    (err, resp) => {
        if (err) throw err;
        console.log('base de datos ONLINE');

    });
app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto 3000');
});