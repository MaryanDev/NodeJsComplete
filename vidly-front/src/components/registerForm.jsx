import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

class RegisterForm extends Form {
	state = {
		data: {
			username: "",
			password: "",
			name: "",
		},
		errors: {},
	};

	schema = {
		username: Joi.string().required().email().label("Username"),
		password: Joi.string().min(5).required().label("Password"),
		name: Joi.string().required().label("Name"),
	};

	doSubmit = () => {
		console.log("Submitted.");
	};

	render() {
		const formTitle = "Register";
		return (
			<div>
				<h1>{formTitle}</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderInput("username", "Username")}
					{this.renderInput("password", "Password", "password")}
					{this.renderInput("name", "Name")}
					{this.renderSubmit(formTitle)}
				</form>
			</div>
		);
	}
}

export default RegisterForm;
