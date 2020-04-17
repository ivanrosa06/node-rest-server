///puerto




process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    //local
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    // server
    urlDB = 'mongodb://conexion server'

}
process.env.URLDB = urlDB;