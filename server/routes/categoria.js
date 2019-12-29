const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
let app = express();
let Categoria = require('../models/categoria')

// ====================================
//      Muestra todas las categorías
// ====================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })
        })
});
// ====================================
//      Muestra una categoría por ID
// ====================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ====================================
//      Crear una Nueva Categoría
// ====================================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoría
    // req.ussuario._id

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
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

// ====================================
//      Actualizar la Categoría
// ====================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
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
// ====================================
//      Eliminar  Categoría
// ====================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Sólo la puede borrar un administrador
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id No existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    });


});



module.exports = app;