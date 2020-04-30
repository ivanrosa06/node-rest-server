const express = require('express');


let { verificaToken, verificaRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria.js');


app.get('/categoria', verificaToken, (req, res) => {
    //todas las categorias
    Categoria.find()
        // esto ordena la lista por parametros
        .sort('descripcion')
        //esto carga informacion de otras tablas.
        .populate('usuario', 'nombre, email')

    .exec((err, categoria) => {
        if (err) {
            return res.status(400).json({

                ok: false,
                err
            });
        }
        Categoria.count({ estado: true }, (err, cantidad) => {
            res.json({
                ok: true,
                categoria,
                Cantidad: cantidad
            })
        })

    });
});

//======================================================================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Categoria.findById(id)


    .exec((err, categoria) => {
        if (err) {
            return res.status(400).json({

                ok: false,
                err
            });
        }
        if (!categoria) {

            return res.status(400).json({
                ok: false,
                err: { message: 'el id no es correcto' }
            });
        }
        res.json({
            ok: true,
            categoria

        })

    });
});
//===================================================================
app.post('/categoria', verificaToken, (req, res) => {
    //crear categgoria
    req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});

app.put('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;

    let body = req.body;
    let desCategoria = {
        descripcion: body.descripcion
    };



    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    //solo administrador va a borrar 
    //categoria.findByIdAndRomove();
    let id = req.params.id

    let cambiaEstado = {
        estado: false
    }
    Categoria.findByIdAndRemove(id, (err, categoriaDelete) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'id no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDelete
        });
    });

});


module.exports = app;