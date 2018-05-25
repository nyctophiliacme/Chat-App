import React, { Component } from 'react';
import './css/App.css';

import Login from "./Login";
import Home from "./Home";
import Dashboard from "./Dashboard";
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
        this.setState({isLoggedIn: true, user: resJSON.email});
        return <Redirect to='/dashboard'/>
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
      // <Redirect to = "/login" push>
      // return <Redirect to='/home'/>

    }
    else
    {
       // history.push('/dashboard');
       // <Redirect to = "/dashboard" push>

       // return <Redirect to='/dashboard'/>
    }
  }
  render() {
    return (
      <Router>
      <div className="App">
        
        {this.DisplayConditionalHome()}
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>

      </Router>
    );
  }
}

export default App;
