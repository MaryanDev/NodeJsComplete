import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import DynamicForm from "./common/dynamicForm";

class LoginForm extends Form {
	state = {
		data: {
			username: "",
			password: "",
		},
		errors: {},
	};

	schema = {
		username: Joi.string().required().label("Username"),
		password: Joi.string().required().label("Password"),
	};

	doSubmit = () => {
		console.log("Submitted.");
	};

	// form = {
	// 	title: "Login",
	// 	inputs: [
	// 		{
	// 			name: "username",
	// 			label: "Username",
	// 		},
	// 		{
	// 			name: "password",
	// 			label: "Password",
	// 			type: "password",
	// 		},
	// 	],
	// 	schema: this.schema,
	// 	onSubmit: this.doSubmit,
	// };

	render() {
		const formTitle = "Login";
		return (
			<div>
				<h1>{formTitle}</h1>
				<form onSubmit={this.handleSubmit}>
					{this.renderInput("username", "Username")}
					{this.renderInput("password", "Password", "password")}
					{this.renderSubmit(formTitle)}
				</form>
			</div>
			// <div>
			// 	<DynamicForm form={this.form} />
			// </div>
		);
	}
}

export default LoginForm;
