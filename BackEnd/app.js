'use strict'

// Cargar modulos de Node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar Express (http)
var app = express(); 

//Cargar ficheros rutas
var article_routes = require('./routes/article');

//Cargar Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Cargar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Anadir prefijos a las rutas /Cargar rutas
app.use('/api', article_routes);
//Ruta o metodo de prueba para el API REST

/*app.get('/probando', (req, res) => {
    return res.status(200).send({
        curso:"Master en Frameworks JS",
        autor: "Victor Robles Web",
        url:"victorroblesweb.es"
    });
});*/

//Exportar modulo (fichero actual)
module.exports = app;