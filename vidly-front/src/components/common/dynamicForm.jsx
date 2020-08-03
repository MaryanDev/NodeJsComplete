import React, { Component } from "react";
import PropTypes from "prop-types";
import Joi from "joi-browser";
import Input from "./input";

class DynamicForm extends Component {
	init = () => {
		const data = {};
		this.props.form.inputs.forEach((input) => (data[input.name] = ""));
		return data;
	};

	state = {
		data: this.init(),
		errors: {},
	};

	componentDidMount() {
		console.log("did mount");

		const data = {};
		this.props.form.inputs.forEach((input) => (data[input.name] = ""));
		this.setState({ data });
	}

	static propTypes = {
		form: PropTypes.shape({
			title: PropTypes.string.isRequired,
			defaultBtnName: PropTypes.string,
			inputs: PropTypes.arrayOf(
				PropTypes.shape({
					name: PropTypes.string.isRequired,
					label: PropTypes.string.isRequired,
					type: PropTypes.string,
				})
			).isRequired,
			schema: PropTypes.object.isRequired,
			buttons: PropTypes.arrayOf(
				PropTypes.shape({
					name: PropTypes.string.isRequired,
					handler: PropTypes.func.isRequired,
				})
			),
			onSubmit: PropTypes.func,
		}),
	};

	validate = () => {
		const options = { abortEarly: false };
		const { error } = Joi.validate(
			this.state.data,
			this.props.form.schema,
			options
		);

		if (!error) {
			return null;
		}

		const errors = {};

		for (let item of error.details) {
			errors[item.path[0]] = item.message;
		}

		return errors;
	};

	validateProperty = ({ name, value }) => {
		const obj = { [name]: value };
		const subSchema = { [name]: this.props.form.schema[name] };
		const { error } = Joi.validate(obj, subSchema);

		return error ? error.details[0].message : null;
	};

	handleSubmit = (event) => {
		event.preventDefault();

		const errors = this.validate();
		this.setState({ errors: errors || {} });
		if (errors) {
			return;
		}

		this.props.form.onSubmit();
	};

	handleChange = ({ currentTarget: input }) => {
		const errors = { ...this.state.errors };

		const errorMessage = this.validateProperty(input);
		if (errorMessage) {
			errors[input.name] = errorMessage;
		} else {
			delete errors[input.name];
		}

		const data = { ...this.state.data };
		data[input.name] = input.value;
		this.setState({ data, errors });
	};

	renderButtons = () => {
		const { buttons, defaultBtnName, title } = this.props.form;
		if (buttons && buttons.length) {
			buttons.map((button) => {
				const { name, handler } = button;
				return (
					<button key={name} onClick={handler} className="btn btn-primary">
						{name}
					</button>
				);
			});
		} else {
			return (
				<button disabled={this.validate()} className="btn btn-primary">
					{defaultBtnName || title}
				</button>
			);
		}
	};

	render() {
		const { title, inputs } = this.props.form;
		const { data, errors } = this.state;
		return (
			<div>
				<h1>{title}</h1>
				<form onSubmit={this.handleSubmit}>
					{inputs.map((input) => {
						const { name, label, type } = input;
						return (
							<Input
								key={name}
								name={name}
								value={data[name]}
								label={label}
								onChange={this.handleChange}
								type={type || "text"}
								error={errors[name]}
							/>
						);
					})}
					{this.renderButtons()}
				</form>
			</div>
		);
	}
}

export default DynamicForm;
