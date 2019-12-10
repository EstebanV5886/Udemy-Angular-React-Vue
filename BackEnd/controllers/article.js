'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Article = require('../models/article');

var controller = {

    datosCurso:(req, res) => {

        return res.status(200).send({
            curso:"Master en Frameworks JS",
            autor: "Victor Robles Web",
            url:"victorroblesweb.es"
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: "Accion Test del controlador de articulos"
        });
    },

    save: (req,res) => {
        //recoger parametros por post

        var params = req.body;
        
        //validar datos con libreria validator

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'Error!',
                message: 'Faltan datos por enviar!'
            });

        }

        if(validate_title && validate_content){
              //crear objeto a guardar
            var article = new Article();

            //asignar valores al objeto

            article.title = params.title;
            article.content = params.content;
            article.image = null;

             //guardar  articulo

            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status:'Error',
                        message: 'El Articulo no se ha guardado!'
                    });
                }

                //devolver una respuesta
                return res.status(200).send({
                    status:'success',
                    article:articleStored
                });


            });

        }else{

            return res.status(200).send({
                status: 'Error!',
                message: 'Los datos no son validos!'
            });
        }       

    },

    getArticles: (req,res) =>{

        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        //find
        query.sort('-_id').exec((err, articles)=>{
            if(err){  
            return res.status(500).send({
                status:'error',
                message:'Error al devolver los articulos!'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status:'error',
                    message:'No hay articulos!'
                });
            }

            return res.status(200).send({
                status:'success',
                articles
            })

        });
        
    },

    getArticle: (req, res) => {
        //recoger id de url

        var article_id = req.params.id;

        //comprobar que existe
        if(!article_id || article_id == null){
            return res.status(404).send({
                status:'Error',
                message:'No existe el articulo!'
            });
        }

        //buscar el articulo

        Article.findById(article_id, (err, article)=>{
            if(err){
                return res.status(500).send({
                    status:'Error',
                    message:'Error al devolver los datos'
                });
            }

            if(!article){
                return res.status(404).send({
                    status:'Error',
                    message:'No existe el Articulo'
                });
            }

            return res.status(200).send({
                status:'Success',
                article
            });
        });

        //devolver el articulo
    },

    update: (res, req) => {
        //Recoger el Id del articulo que viene por url
        var article_id = req.params.id;
        //recoger los datos que llegan por put
        var params = req.body;
        //validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(500).send({
                status:'Error',
                message:'Faltan datos por enviar'
            });
        }
        if(validate_title && validate_content){
            //Find And Update
            Article.findOneAndUpdate({_id:articleID}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status:'Error',
                        message:'Error al actualizar'
                    });
                }
                if(!articleUpdated){
                    return res.status(404).send({
                       status:'Error',
                       message:'No existe el Articulo' 
                    });
                }
                return res.status(200).send({
                    status:'success',
                    article: articleUpdated
                });
            });
        }else{
            return res.status(500).send({
                status:'Error',
                message:'La validacion no es correcta!'
            });
        }
    },

    delete: (req, res) => {
        //Obtener id de la URL
        var article_id = req.params.id;
        //Find and Delete
        Article.findByIdAndDelete({_id:article_id},(err, articleRemoved)=>{
            if(err){
                return res.status(500).send({
                    status:'Error',
                    message:'Error al Eliminar!'
                });
            }
            if(!articleRemoved){
            return res.status(404).send({
                status:'Error',
                message:'No se ha borrado el articulo, posiblemente no exista!'
             });

            }

            return res.status(200).send({
                status:'Success',
                article:articleRemoved

            });

        });
    },

    upload: (req, res) => {
        //Configurar el modulo del connect multiparty router/article.js
        

        //Recoger el ficher de la peticion
            var file_name = "Imagen no subida...";
            if(!req.files){
                return res.status(404).send({
                    status:'error',
                    message:file_name
                });
            }
        //Conseguir el nombre y la extension del archivo
            var file_path = req.files.file0.path;
            var file_split = file_path.split('\\');
        //Nombre del Archivo
        
            var file_name = file_split[2];

            //Extension del fichero

            var extension_split = file_name.split('\.');
            var file_ext = extension_split[1];
        
        //Comprobar la extension, solo imagenes

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //borrar el archivo subido
            fs.unlink(file_path, (err)=>{
                return res.status(500).send({
                    status:'error',
                    message:'La extension de la imagen no es valida'
                });
            });
        }else{
            var article_id = req.params.id;
            //Si todo es valido, buscar el articulo, asignarle la imagen y actualizarla
            Article.findOneAndUpdate({_id:article_id}, {image:file_name}, {new:true}, (err, articleUpdated)=>{

                if(err || !articleUpdated){
                    return res.status(500).send({
                        status:'Error',
                        message:'Error al guardar la imagen del articulo'
                    });
                }

                return res.status(200).send({
                    status:'success',
                    article:articleUpdated
                })
            });
        }

        
    },//Fin Upload File

    getImage:(req, res) =>{

        var file = req.params.image;

        var path_file = './upload/articles/'+ file;

        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status:'Error',
                    message:'La imagen no existe'
                });
            }
        });
    },

    search:(req, res)=>{
        //Sacar el String a buscar
        var search_string = req.params.search;
        //Find or
        Article.find({
            "$or":[
                {"title":{"$regex":search_string, "$options":"i"}},
                {"content":{"$regex":search_string, "$options":"i"}},
            ]
        })
        .sort([['date','descending']])
        .exec((err, articles) =>{

            if(err){
                return res.status(500).send({
                    status:'Error',
                    message:'Error en la busqueda'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status:'error',
                    message:'No hay articulos que coincidan con tu busqueda'
                });
            }

            return res.status(200).send({
                status:'success',
                articles
            })

        });
    }//Fin Search

};// FIn del cotrolador

module.exports = controller;