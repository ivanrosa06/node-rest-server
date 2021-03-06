const jwt = require('jsonwebtoken')
    //======================
    // verificar token
    //=====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

};


//======================
// verificar token
//=====================
let verificaTokenimg = (req, res, next) => {
    //invia paramtros por url
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    });

}



///////////
let verificaRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        });
    }





};
module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenimg
}