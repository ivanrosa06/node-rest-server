///puerto




process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//vencimiento DEL TOKEN 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//seed de auteticacion
process.env.SEED = process.env.SEED || 'secret'

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    //local
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    // server
    urlDB = 'mongodb://conexion server'

}
process.env.URLDB = urlDB;