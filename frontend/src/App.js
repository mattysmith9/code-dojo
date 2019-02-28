import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utilities/set-auth-token';
import { setCurrentUser, logoutUser } from './actions/auth-actions';
import { clearCurrentProfile } from './actions/profile-actions';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/authorize/Register';
import Login from './components/authorize/Login';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

/* CHECK FOR TOKEN */
if (localStorage.jwtToken) {
	/* SET AUTH TOKEN HEADER FOR AUTHORIZATION */
	setAuthToken(localStorage.jwtToken);

	/* DECODE TOKEN AND GET USER INFO AND EXPIRATION */
	const decoded = jwt_decode(localStorage.jwtToken);

	/* SET USER AND IS AUTHENTICATED */
	store.dispatch(setCurrentUser(decoded));

	/* CHECK FOR EXPIRED TOKEN */
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		store.dispatch(logoutUser());
		store.dispatch(clearCurrentProfile());
	}

	/* TODO: REDIRECT TO LOGIN */
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/dashboard" component={Dashboard} />
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
