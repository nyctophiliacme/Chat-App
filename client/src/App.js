import React, { Component } from 'react';
import './App.css';

import Login from "./Login";
import Home from "./Home";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

class App extends Component {
  state = { 
    user: "",
    isLoggedIn: false
  };
  componentDidMount()
  {
    fetch('/checkLogin',
    {
      method: 'GET',
      credentials: 'same-origin'
    }) 
    .then((response) => response.text())
    .then((res) => {
      var resJSON = JSON.parse(res);
      console.log(resJSON.result);
      if(resJSON.result === 'Session Exists')
      {
        this.setState = {isLoggedIn: true, user: resJSON.email};
      }
    })
    .catch((error) => {
        console.error(error);
    });
  }
  DisplayConditionalHome()
  {
    if(this.state.isLoggedIn === false)
    {
      // return <Login />
    }
    else
    {
      // return <Login />
    }
  }
  render() {
    return (
      <Router>
      <div className="App">
        
        {this.DisplayConditionalHome()}
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>

      </Router>
    );
  }
}

export default App;
