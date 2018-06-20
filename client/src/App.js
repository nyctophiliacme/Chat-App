import React, { Component } from 'react';
import Login from "./Login";
import Home from "./Home";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import ProfilePage from "./ProfilePage";
import GenericNotFound from "./GenericNotFound";
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
      {/*}    <Route exact path="/" component={Home} />   */}
          <Route exact path='/' 
                  render={() => 
                    this.state.user.isLoggedIn ? 
                      <Redirect to="/dashboard" Dashboard authenticate={this.authenticate} user={this.state.user}  /> : 
                      <Redirect to="/home" Home/> }/>

     {/*}     <Route exact path="/home" component={Home} />  */}
          <Route exact path='/home' 
                  render={() => 
                    this.state.user.isLoggedIn ? 
                      <Redirect to="/dashboard" Dashboard authenticate={this.authenticate} user={this.state.user}  /> : 
                      <Home/> }/>

          <Route exact path="/login" 
                       render={() => <Login authenticate={this.authenticate} />} />

          <Route exact path='/signup' 
                       render={() => <Signup authenticate={this.authenticate} />} />

          <Route exact path='/dashboard' 
                  render={() => 
                    this.state.user.isLoggedIn ? 
                      <Dashboard authenticate={this.authenticate} user={this.state.user}  /> : 
                      <Redirect to="/home"/> }/>

          <Route exact path='/user/:email'
                 render = { (props) => <ProfilePage {...props} user={this.state.user} />} />

          <Route component = {GenericNotFound} />
        </Switch>
      </div>
      </Router>
    );
  }
}
