const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');




let app = express();
let Producto = require('../models/producto');




//obtener producto
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    //todas las categorias
    Producto.find()
        //esto carga informacion de otras tablas.
        .populate('usuario', 'nombre, email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({

                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    Cantidad: cantidad
                })
            })

        });


});
//productos por ID

app.get('/productos/:id', verificaToken, (req, res) => {

    //populate: usuario categoria
    //paginado
    let id = req.params.id;


    Producto.findById(id)
        .populate('usuario', 'nombre, email')
        .populate('categoria', 'descripcion')

    .exec((err, productoDB) => {
        if (err) {
            return res.status(400).json({

                ok: false,
                err
            });
        }
        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: { message: 'el id no es correcto' }
            });
        }
        res.json({
            ok: true,
            producto: productoDB

        })

    });
    // ===========================
    //  Buscar productos
    // ===========================
    app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

        let termino = req.params.termino;

        let regex = new RegExp(termino, 'i');

        Producto.find({ nombre: regex })
            .populate('categoria', 'nombre')
            .exec((err, productos) => {


                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            });

    });
});

app.post('/productos', verificaToken, (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }


        res.status(210).json({
            ok: true,
            producto: productoDB
        });


    });


});
app.put('/productos/:id', (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;
    let desproducto = {
        descripcion: body.descripcion
    };
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Producto: productoDB
        });
    });


});
//=======================borrar========================
app.delete('/productos/:id', (req, res) => {


    let id = req.params.id

    let cambiaEstado = {
        disponible: false
    }
    Producto.findOneAndUpdate(id, cambiaEstado, (err, productoDelete) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!productoDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            Producto: productoDelete,
            err: {
                message: 'Producto deshabilitado'
            }
        });
    });



});
module.exports = app;