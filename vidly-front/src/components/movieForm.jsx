import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getGenres } from "../services/genreService";
import { saveMovie, getMovie } from "../services/movieService";

class MovieForm extends Form {
	state = {
		data: {
			title: "",
			genreId: "",
			numberInStock: "",
			dailyRentalRate: "",
		},
		genres: [""],
		errors: {},
	};

	get movieId() {
		const { id } = this.props.match.params;
		return id === "new" ? "" : id;
	}

	async populateGenres() {
		const { data: genres } = await getGenres();
		this.setState({ genres: ["", ...genres] });
	}

	async populateMovie() {
		try {
			if (this.movieId) {
				const { data: movie } = await getMovie(this.movieId);
				const data = {};
				data.title = movie.title;
				data.genreId = movie.genre._id;
				data.numberInStock = movie.numberInStock;
				data.dailyRentalRate = movie.dailyRentalRate;

				this.setState({ data });
			}
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				return this.props.history.replace("/not-found");
			}
		}
	}

	async componentDidMount() {
		await this.populateGenres();
		await this.populateMovie();
	}

	schema = {
		title: Joi.string().required().label("Title"),
		genreId: Joi.string().required().label("Genre"),
		numberInStock: Joi.number()
			.min(0)
			.max(100)
			.required()
			.label("Number In Stock"),
		dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
	};

	doSubmit = async () => {
		const data = { ...this.state.data };
		data._id = this.movieId;
		await saveMovie(data);
		this.props.history.push("/movies");
	};

	render() {
		return (
			<React.Fragment>
				<h1>Movie Form {this.movieId}</h1>
				<div>
					<form onSubmit={this.handleSubmit}>
						{this.renderInput("title", "Title")}
						{this.renderSelect("genreId", "Genre", this.state.genres)}
						{this.renderInput("numberInStock", "Number in Stock", "number")}
						{this.renderInput("dailyRentalRate", "Rate", "number")}
						{this.renderSubmit("Save")}
					</form>
				</div>
			</React.Fragment>
		);
	}
}

export default MovieForm;
