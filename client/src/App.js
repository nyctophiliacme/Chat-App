import React, { Component } from 'react';
import './App.css';
import Login from "./Login";

class App extends Component {
  state = { 
    users: [],

  };
  componentDidMount()
  {
     // fetch('/users')
     // .then(res => res.json())
     // .then(users => this.setState({ users }));

    fetch('/checkLogin') 
    .then((response) => response.text())
    .then((responseText) => {
      console.log(responseText);
    })
    .catch((error) => {
        console.error(error);
    });
  }
  handleClick = event => {
    event.preventDefault();
    console.log("Link was Clicked");
    window.location = "login.html";
  }
  onSubmit = fields => {
    console.log("Fields are", fields);
    console.log(fields.email)
    console.log("Stringified", JSON.stringify({fields}));
    fetch('/login',
    {
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       method: 'POST',
       body: JSON.stringify({email: fields.email, password: fields.password})
       //JSON.stringify({ fields })
    })
    .then((response) => response.text())
    .then((responseText) => {
      console.log(responseText);
    })
    .catch((error) => {
        console.error(error);
    });

  };
  render() {
    return (
      <div className="App">
        <ul>
          {this.state.users.map(user => 
            <li key = {user.id} > {user.username} </li>
          )}
        </ul>
        <button onClick={this.handleClick}> Login Form </button>
        <Login onSubmit = {fields => this.onSubmit(fields)}/>
        <p>
          {JSON.stringify(this.state.fields, null, 2)}
        </p>
      </div>

    );
  }
}

export default App;
