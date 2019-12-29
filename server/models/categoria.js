const moongose = require('mongoose')
const Schema = moongose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Es necesario poner una Descripcion']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = moongose.model('Categoria', categoriaSchema);