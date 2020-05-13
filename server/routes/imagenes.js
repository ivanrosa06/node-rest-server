const express = require('express');

const fs = require('fs');
const path = require('path')
const { verificaTokenimg } = require('../middlewares/autenticacion');
let app = express();


app.get('/imagen/:tipo/:img', verificaTokenimg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let patImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(patImagen)) {
        res.sendFile(patImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/original.jpg')
            //esto lee el tipo de contenido del archivo
        res.sendFile(noImagePath);
    }

});




module.exports = app;