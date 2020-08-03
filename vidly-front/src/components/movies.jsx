import React, { Component } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import { getMovies, deleteMovie } from "../services/movieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import { getGenres } from "../services/genreService";
import MoviesTable from "./moviesTable";
import SearchBox from "./common/searchBox";

class Movies extends Component {
	state = {
		movies: [],
		genres: [],
		pageSize: 4,
		currentPage: 1,
		sortColumn: {
			path: "title",
			order: "asc",
		},
		search: "",
		selectedGenre: null,
	};

	async componentDidMount() {
		const { data } = await getGenres();
		const { data: movies } = await getMovies();
		const genres = [{ _id: "", name: "All genres" }, ...data];
		this.setState({ movies, genres });
	}

	deleteMovie = async (movieId) => {
		const originalMovies = this.state.movies;
		const movies = originalMovies.filter((m) => m._id !== movieId);
		this.setState({
			movies,
		});

		try {
			await deleteMovie(movieId);
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				toast.error("This movie has already been deleted");
			}

			this.setState({ movies: originalMovies });
		}
	};

	handleFavoriteClick = (movie) => {
		const movies = [...this.state.movies];
		const index = movies.indexOf(movie);
		movies[index] = { ...movie };
		movies[index].isFavorite = !movies[index].isFavorite;
		this.setState({ movies });
	};

	handlePageClick = (page) => {
		this.setState({ currentPage: page });
	};

	handleGenreSelect = (genre) => {
		this.setState({ selectedGenre: genre, currentPage: 1 });
	};

	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
	};

	handleSearch = (query) => {
		this.setState({
			search: query,
			selectedGenre: query ? null : this.state.selectedGenre,
			currentPage: 1,
		});
	};

	getPagedData = () => {
		const {
			selectedGenre,
			sortColumn,
			currentPage,
			pageSize,
			movies,
			search,
		} = this.state;

		let filtered =
			selectedGenre && selectedGenre._id
				? movies.filter((m) => m.genre._id === selectedGenre._id)
				: movies;

		if (search)
			filtered = filtered.filter(
				(m) => m.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
			);

		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

		const moviesToRender = paginate(sorted, currentPage, pageSize);

		return { totalCount: filtered.length, data: moviesToRender };
	};

	createMovie = () => {
		this.props.history.push("/movies/new");
	};

	render() {
		const { length: count } = this.state.movies;
		const {
			currentPage,
			pageSize,
			selectedGenre,
			genres,
			sortColumn,
			search,
		} = this.state;

		if (count === 0) {
			return <p>There are no movies in he database.</p>;
		}

		const { totalCount, data: movies } = this.getPagedData();

		return (
			<div className="row">
				<div className="col-2">
					<ListGroup
						onItemSelect={this.handleGenreSelect}
						selectedItem={selectedGenre}
						items={genres}
					/>
				</div>
				<div className="col">
					<button
						onClick={this.createMovie}
						className="btn btn-info btn-lg mb-2"
					>
						New Movie
					</button>
					<p>{`Showing ${totalCount} movies in the database.`}</p>
					<SearchBox value={search} onChange={this.handleSearch} />
					<MoviesTable
						movies={movies}
						sortColumn={sortColumn}
						search={search}
						onFavoriteClick={this.handleFavoriteClick}
						onDelete={this.deleteMovie}
						onSort={this.handleSort}
					/>
					<Pagination
						onPageClick={this.handlePageClick}
						currentPage={currentPage}
						pageSize={pageSize}
						count={totalCount}
					/>
				</div>
			</div>
		);
	}
}

export default Movies;
