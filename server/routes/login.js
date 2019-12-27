const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Wey la pinche contraseña está mal, o (no eres tu) pendejo'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Wey (la pinche contraseña está mal), o no eres tu pendejo'
                }
            });
        };

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })

});

// Configuraciones de Google 

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

// Redirecciona a la ruta de Google
app.post('/google', async(req, res) => {
    // Cuando se hace un posteo se recibe el Token
    let token = req.body.idtoken;
    // Cuando se recibe el Token se pide la función de 'Verify' a google
    // Si el token es inválido no se va a ejecutar
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'El Token Autenticacion de Google es Invalido'
                }
            });
        });

    // Si lo hace correctamente se va a tener un usuario que se llama googleUser con toda la infomación que proviene de Google
    // Se busca un usuario en la base de datos para confirmar si existe en la BBDD local a través del correo que es un campo único
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        // Si el usuario no existe en la BBDD local entonces retorne err status (500)
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Usuario no existe en la BBDD'
                }
            });
        };
        // Si el usuario existe en la base de datos, renueve su token local para que tenga acceso
        if (usuarioDB) {
            // Comprueba si el usuario no existe en la BBDD y retorna el Error
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El usuario no se está autenticando a través de Google'
                    }
                });
                // Si el usuario existe autentiquelo y renueve su token 
            } else {
                // Renueva el Token 
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                // Autentica con la BBDD y entrega los datos 
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            // Si el usuario NO existe en la base de datos 
            // Y es la primera vez que lo hace con google
            // Crea las Variables tomadas de la información que brinda Google

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            // Graba en la base de datos con esos Datos
            // Si hay un error con los datos de Google retorna error
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                // Crea el Token de Autenticación en la BBDD
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                // Graba en la BBDD
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }
    });
});

module.exports = app;