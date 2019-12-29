const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

// ======================================
//       Obtener Todos los Productos 
// ======================================
app.get('/productos', verificaToken, (req, res) => {
    // traer todos los productos
    // cargar quie es el usuario y la categoría
    // Traer los Productos Paginados

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })

});
// ======================================
//       Obtener un producto por ID 
// ======================================
app.get('/productos/:id', (req, res) => {
    // cargar quien es el usuario y la categoría
    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
// ======================================
//       Buscar Productos
// ======================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
});


// ======================================
//       Crear un Producto
// ======================================
app.post('/productos', verificaToken, (req, res) => {
    // cargar quien es el usuario y la categoría

    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });


});

// ======================================
//       Actualizar un Producto
// ======================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // cargar quien es el usuario y la categoría

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

// ======================================
//       Borrar un Producto
// ======================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // Hay que cambiar el estado de 'disponible'
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })
        })
    })

});


module.exports = app;