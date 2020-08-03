import http from "./httpService";
import { apiUrl } from "../config.json";

const movieApiUri = `${apiUrl}/movies`;

function getMovieUrl(id) {
	return `${movieApiUri}/${id}`;
}

export function getMovies() {
	return http.get(movieApiUri);
}

export function getMovie(id) {
	return http.get(getMovieUrl(id));
}

export function saveMovie(movie) {
	const { _id } = movie;
	const body = { ...movie };
	delete body._id;
	if (_id) {
		return http.put(getMovieUrl(_id), body);
	}
	return http.post(movieApiUri, body);
}

export function deleteMovie(id) {
	return http.delete(getMovieUrl(id));
}
