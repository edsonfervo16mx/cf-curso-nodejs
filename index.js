var express = require("express");
var app = express();
var User = require("./models/user").User;
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var http = require("http");
var realtime = require("./realtime")

app.use("/files",express.static("public"));

//express-formidale
//cargar imagenes
var formidable = require("express-formidable");
/**/
app.use(formidable({keepExtensions: true, encoding: 'utf-8',
  uploadDir: 'images'}))

/**/
//method-override
//middleware de http para el uso de put y delete
/**/
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

/**/
//body-parser
/*
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
/**/
//express-session
/**/
var session = require("express-session");
/*
app.use(session({
	secret: "qwerty123",
	resave: false,
	saveUninitialized: false
}));
/**/
//connect-redis
/**/
var RedisStore = require("connect-redis")(session);
var sessionMiddleware = session({
	store: new RedisStore({}),
	secret: "super ultra secret word"
})
app.use(sessionMiddleware);
/**/
//
//cookie-session
/*
var cookieSession = require("cookie-session");
app.use(cookieSession({
	name: "session",
	keys: ["key1","key2"]
}));
/**/
//configuracion socket.io -> express
/**/
var server = http.Server(app);
realtime(server,sessionMiddleware);
/**/
//
//
app.set("template engine","pug");

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("index.pug");
});


app.get("/signup",function(req,res){
	User.find(function(err,doc){
		//console.log(doc);
		res.render("signup.pug");		
	});
});

app.get("/signin",function(req,res){
	User.find(function(err,doc){
		res.render("signin.pug");		
	});
});

app.post("/registerusers",function(req,res){

	var qm = new User({
						email: req.fields.email,
						password: req.fields.password,
						password_confirmation:req.fields.password_confirmation,
						username:req.fields.username
					});

	console.log(req.fields.password_confirmation);

	//guardando normalmente los datos 
	/**
	qm.save(function(err,doc,row){
		if(err){
			console.log(String(err));
		}
		res.send("Guardamos tus datos");
	});
	/**/

	//guardando con promises otra forma de guardar datos
	/**/
		qm.save().then(function(doc){
			res.send("Guardamos tus datos con promises");
		},function(err){
			if(err){
				console.log(String(err));
				res.send("No se ha podido guardar con promises");
			}
		});
	/**/

});

app.post("/sessions",function(req,res){

	User.findOne({email: req.fields.email,password: req.fields.password},function(err,doc){
		//console.log(doc);
		//res.send("consulta find");
		req.session.user_id = doc._id;
		//res.send("test session");
		res.redirect("/app");
	});

});

app.use("/app",session_middleware);
app.use("/app",router_app);

//app.listen(8080);
server.listen(8080);