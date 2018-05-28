import React, { Component } from 'react';
import Login from "./Login";
import Home from "./Home";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import CreateChannel from "./CreateChannel";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

export default class App extends Component {
  constructor(props) {
    super(props);

    let user = {
      isLoggedIn: false
    }

    try {
      let userJsonString = localStorage.getItem("chat-hub");
      if (userJsonString) {
        user = JSON.parse(userJsonString);
      }
    } catch (exception) {
    }

    this.state = 
    { 
      user: user
    };

    this.authenticate = this.authenticate.bind(this);
  }

  authenticate(user) {
    this.setState({
      user: user
    });

    // updating user's details
    localStorage.setItem("chat-hub", JSON.stringify(user));
  }
  // {this.DisplayConditionalHome()}
  render() {
    return (
      <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/login" render={() => <Login authenticate={this.authenticate} />} />
          <Route path='/signup' render={() => <Signup authenticate={this.authenticate} />} />
          <Route path='/dashboard' render={() => (
            this.state.user.isLoggedIn ? 
                    (<Dashboard authenticate={this.authenticate} user={this.state.user}  />) : 
                    (<Redirect to="/home"/>)
          )} />
          <Route path='/createChannel' render={() => (
            this.state.user.isLoggedIn ? 
                    (<CreateChannel user={this.state.user}  />) : 
                    (<Redirect to="/home"/>)
          )} />
        </Switch>
      </div>
      </Router>
    );
  }
}
