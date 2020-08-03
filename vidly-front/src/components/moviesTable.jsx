import React, { Component } from "react";

import Like from "./common/like";
import Table from "./common/table";
import { Link } from "react-router-dom";
import Highlight from "react-highlighter";

class MoviesTable extends Component {
	columns = [
		{
			path: "title",
			label: "Title",
			content: (movie) => (
				<Link to={`/movies/${movie._id}`}>
					<Highlight search={this.props.search}>{movie.title}</Highlight>
				</Link>
			),
		},
		{ path: "genre.name", label: "Genre" },
		{ path: "numberInStock", label: "Stock" },
		{ path: "dailyRentalRate", label: "Rate" },
		{
			key: "like",
			content: (movie) => (
				<Like
					onFavoriteClick={() => this.props.onFavoriteClick(movie)}
					isFavorite={movie.isFavorite}
				/>
			),
		},
		{
			key: "delete",
			content: (movie) => (
				<button
					className="btn btn-danger btn-sm"
					onClick={() => this.props.onDelete(movie._id)}
				>
					Delete
				</button>
			),
		},
	];

	render() {
		const { movies, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				data={movies}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default MoviesTable;
