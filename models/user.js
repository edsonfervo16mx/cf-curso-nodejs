var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/example");

var sex_value = ["F","M"];
var email_match =[/^\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/,"email not valid"];

var user_schema = new Schema({
	name: String,
	username: {type: String,required: true,maxlength:[50,"username is very large"]},
	password: {
		type: String,
		minlength:[8,"password is very small"],
		validate: {
			validator: function(pass){
				return this.password_confirmation == pass;
			},
			message: "passwords are not the same"
		}
	},
	age: {type: Number,min:[18,"Your age is not appropriate"],max:[100,"Limit exceeded"]},
	email: {type: String, required:"email is required",match: email_match},
	date_of_bith: Date,
	sex: {type: String,enum:{values: sex_value, message:"value not valid"}}
});
/*
	String
	Number
	Date
	Buffer
	Boolean
	Mixed
	Objectid
	Array
*/

/*virtuals*/
user_schema.virtual("password_confirmation").get(function(){
	return this.pass_confirmation;
}).set(function(password){
	this.pass_confirmation= password;
});
/**/

var User = mongoose.model("User",user_schema);


module.exports.User = User;