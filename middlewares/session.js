var User = require("../models/user").User;

module.exports = function(req,res,next){
	if(!req.session.user_id){
		res.redirect("/signin");
	}else{
		User.findById(req.session.user_id,function(err,doc){
			if(err){
				console.log(err);
				res.redirect("/signin");
			}else{
				res.locals = { user: doc };
				next();
			}
		});

	}
}