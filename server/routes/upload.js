const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs')
const path = require('path')
    //default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha selecionado ningun archivo'
                }
            });
    }
    // tipos validos
    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'los tipos no valida, solo  ' + tiposValidos.join(','),

                }
            });
    }

    let archivo = req.files.archivo;


    let nombreArchivo2 = archivo.name.split('.');
    let extension = nombreArchivo2[nombreArchivo2.length - 1];
    //extenciones permitidas

    let extenciones = ['png', 'jpg', 'gif', 'jpeg']

    if (extenciones.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Extencion no valida, solo  ' + extenciones.join(','),
                    ext: extension
                }
            });
    }
    //cambiar nombre de archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, function(err) {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });



        }
        //aqui ya se subio
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo)
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: { message: 'usuario no existe' }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo


        usuarioDB.save((err, usuarioSave) => {
            res.json({

                ok: true,
                usuario: usuarioSave,
                img: nombreArchivo
            });

        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productodb) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productodb) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: { message: 'producto no existe' }
            });
        }

        borrarArchivo(productodb.img, 'productos');
        productodb.img = nombreArchivo


        productodb.save((err, productoSave) => {
            res.json({

                ok: true,
                producto: productoSave,
                img: nombreArchivo
            });

        });
    });

}

function borrarArchivo(nombreImagen, tipo) {
    let patImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(patImagen)) {
        fs.unlinkSync(patImagen);
    }


}

module.exports = app;