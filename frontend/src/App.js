import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { clearCurrentProfile } from './actions/profile-actions';
import { logoutUser } from './actions/auth-actions';
import { setCurrentUser } from './actions/auth-actions';
import setAuthToken from './utilities/set-auth-token';
import Register from './components/authorize/Register';
import NotFound from './components/not-found/NotFound';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';
import EditProfile from './components/edit-profile/EditProfile';
import Post from './components/post/Post';
import Posts from './components/posts/Posts';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './components/authorize/Login';
import Landing from './components/layout/Landing';
import Profile from './components/profile/Profile';
import Profiles from './components/profiles/Profiles';
import AddEducation from './components/add-credentials/AddEducation';
import CreateProfile from './components/create-profile/CreateProfile';
import AddExperience from './components/add-credentials/AddExperience';
import jwt_decode from 'jwt-decode';
import store from './store';
import './App.css';

/* Check for token */
if (localStorage.jwtToken) {
  /* Set auth token header auth */
  setAuthToken(localStorage.jwtToken);
  /* Decode token and get user info and exp */
  const decoded = jwt_decode(localStorage.jwtToken);
  /* Set user and isAuthenticated */
  store.dispatch(setCurrentUser(decoded));

  /* Check for expired token */
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    /* Logout user */
    store.dispatch(logoutUser());
    /* Clear current Profile */
    store.dispatch(clearCurrentProfile());
    /* Redirect to login */
    window.location.href = '/login';
  }
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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:handle" component={Profile} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}
                />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/feed" component={Posts} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
