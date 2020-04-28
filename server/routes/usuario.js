const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion')


app.get('/usuario', verificaToken, (req, res) => {
   
        // let desde = req.query.desde || 0;
        // desde = number(desde);
        // let limite = req.query.limite || 0;
        // limite = number(limite);
        //El find sin condiciones dice que envie todos los elementos que encuentre
        //exec dice que ejecute el find y devuelve un error y un array que podremos meter en usuarios
        //Entre las llaves se puede agregar condiciones de lo que queremos recibir por respuesta
        //find({ google: true }) //devolvera todos los que se hayan registrados por google
        // , 'nombre email' nos permite determinar que parametros queremos devolver en el json
        //Agregamos condicion en el find solo me devuelva usuarios con estado: true
    Usuario.find({ estado: true }, 'nombre email role estado google')
        //salta los registros
        // .skip(desde)
        //limite de registros
        //.limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({

                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, cantidad) => {
                res.json({
                    ok: true,
                    usuarios,
                    Cantidad: cantidad
                })
            })

        });
});

app.post('/usuario', [verificaToken, verificaRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

});

app.put('/usuario/:id', [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete('/usuario/:id', [verificaToken, verificaRole], function(req, res) {
    let id = req.params.id

    let cambiaEstado = {
        estado: false
    }
    Usuario.findOneAndUpdate(id, cambiaEstado, (err, usuarioDelete) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDelete
        });
    });

});

module.exports = app;