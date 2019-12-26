const moongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol de usuario válido'
}


let Schema = moongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡¡ Hay que poner un nombre pendejo !!!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, '¡¡ Hay que poner un correo pendejo !!!']
    },
    password: {
        type: String,
        required: [true, '¡¡ Hay que poner una puta contraseña imbecil !!!']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{ PATH } debe ser único ¡¡¡ Pendejo !!! ' })
module.exports = moongoose.model('Usuario', usuarioSchema)