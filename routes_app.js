var express = require("express");
var Imagen = require("./models/imagenes");
var router = express.Router();
var image_finder_middleware = require("./middlewares/find_image");
var fs = require("fs");
var redis = require("redis");

var client = redis.createClient();


router.get("/",function(req,res){
	/*validar usuario*/
	Imagen.find({})
		.populate("creator")
		.exec(function(err,imagenes){
			if(err){
				console.log(err);
			}
			res.render("app/home.pug",{imagenes: imagenes});
		})
});

/* REST */
// CRUD
router.get("/imagenes/new",function(req,res){
	res.render("app/imagenes/new.pug");
});

//middleware find
router.all("/imagenes/:id*",image_finder_middleware);
//

router.get("/imagenes/:id/edit",function(req,res){
	res.render("app/imagenes/edit.pug");
});
//imagen
router.route("/imagenes/:id")
	.get(function(req,res){
		//socket.io
			//client.publish("images",res.locals.imagen.toString());
		//teste socket.io
		res.render("app/imagenes/show.pug");
	})
	.put(function(req,res){
		//modificando los datos
		/**/
		res.locals.imagen.title = req.fields.title;
		res.locals.imagen.save(function(err){
			if (!err) {
				res.render("app/imagenes/show.pug");
			}else{
				res.render("app/imagenes/"+res.params.id+"/edit.pug");
			}
		});
		/**/
	})
	.delete(function(req,res){
		//eliminar imagenes
		Imagen.findOneAndRemove({_id: req.params.id},function(err){
			if(!err){
				 res.redirect("/app/imagenes");
			}else{
				console.log(err);
				res.redirect("/app/imagenes"+req.params.id);
			}
		});
	});

//collection
router.route("/imagenes")
	.get(function(req,res){
		Imagen.find({creator: res.locals.user._id},function(err,imagenes){
			if(err){
				res.redirect("/app");
				return;
			}
			res.render("app/imagenes/index.pug",{imagenes: imagenes});
		});
	})
	.post(function(req,res){
		var extension = req.files.file.name.split(".").pop();
		console.log(req.files.file.name);
		console.log(req.files.file.path);
		console.log(req.files.file.type);
		var data = {
			title: req.fields.title,
			creator: res.locals.user._id,
			extension: extension
		}

		var imagen = new Imagen(data);

		imagen.save(function(err){
			if (!err) {
				//socket.io
				var imgJSON = {
					"id": imagen._id,
					"title": imagen.title,
					"extension": imagen.extension
				}
				client.publish("images",JSON.stringify(imgJSON));
				//client.publish("images",imagen.toString());
				//
				fs.rename(req.files.file.path, "public/img/"+imagen._id+"."+extension);
				res.redirect("/app/imagenes/"+imagen._id);
			}else{
				console.log(imagen);
				res.render(err);
			}
		})
	});

module.exports = router;
