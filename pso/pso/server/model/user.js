const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userDetailSchema = new mongoose.Schema({
	fname: { type: String, required: true },
	lname: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isFacebookUser: { type: Boolean, default: false },
	gender: { type: String, required: true },
	isAdmin:{ type: Boolean, default : false},
    ph:{type:String, unique : true},
   
});

userDetailSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const UserInfo = mongoose.model("UserInfo", userDetailSchema);

const validate = (data) => {
	const schema = Joi.object({
		fname: Joi.string().required().label("First Name"),
		lname: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		isFacebookUser: { type: Boolean, default: false },
		gender: Joi.string().optional().allow("").label("gender")
		
	});
	return schema.validate(data);
};

module.exports = { UserInfo, validate };



  