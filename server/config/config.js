// ======================
//     Puerto 
// ======================
process.env.PORT = process.env.PORT || 3000;
// ======================
//     Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ======================
//  Expiración del Token
// ======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 15

// ======================
//  Semilla SEED 
// ======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

// ============
//     BBDD
// ============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;