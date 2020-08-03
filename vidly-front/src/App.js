import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Movies from "./components/movies";
import Navbar from "./components/navbar";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<React.Fragment>
			<ToastContainer />
			<main className="container">
				<Navbar />

				<div className="mt-4">
					<Switch>
						<Route path="/movies/:id" component={MovieForm} />
						<Route path="/login" component={LoginForm} />
						<Route path="/register" component={RegisterForm} />
						<Route path="/movies" component={Movies} />
						<Route path="/customers" component={Customers} />
						<Route path="/rentals" component={Rentals} />
						<Redirect from="/" exact to="/movies" />
						<Route path="/not-found" component={NotFound} />
						<Redirect to="/not-found" />
					</Switch>
				</div>
			</main>
		</React.Fragment>
	);
}

export default App;
