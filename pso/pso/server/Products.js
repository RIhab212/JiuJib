const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const multer = require('multer');
const express = require('express');
const app = express();


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
	location: { type: String, required: true },
	productName: { type: String, required: true },
	description: { type: String, required: true },
	photo: { type: String, required: true },
	isConfirmed: { type: Boolean, default: false },
	email : { type: String, default: null},
	Notif : { type: Boolean, default: true },
	status : { type: String, default: null}
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};
const Product =  mongoose.model("product", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		location: Joi.string().required().label(" location"),
		productName: Joi.string().required().label("productName"),
		description: Joi.string().required().label("description"),
		status: Joi.string().required().label("description"),
		photo: Joi.string().optional().allow(""),



	});
	return schema.validate(data);
};


module.exports = { Product, validate };
