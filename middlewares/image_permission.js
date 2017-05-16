var Imagen = require("../models/imagenes");

module.exports = function(image,req,res){
	// true -> tiene los permisos
	//false -> NO tiene los permisos


	if (req.method === "GET" && req.path.indexOf("edit") < 0) {
		//ver la imagen
		return true;
	}

	if (typeof image.creator == "undefined") {
		return false;
	}

	if (image.creator._id.toString() == res.locals.user._id) {
		// validar que sean tus imagenes
		return true;
	}

	return false;
}