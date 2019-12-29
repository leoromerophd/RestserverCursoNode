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

process.env.CADUCIDAD_TOKEN = '48h'

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

// =====================
//     Google Client ID
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '223373700733-7dk0dfu8b9ua52vv9a2unpjm8fi2jhds.apps.googleusercontent.com';