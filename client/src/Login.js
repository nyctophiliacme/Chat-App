import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      fireRedirect: false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('/login',
      {
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         method: 'POST',
         credentials: 'same-origin',
         body: JSON.stringify({email: this.state.email, password: this.state.password})
         //JSON.stringify({ fields })
      })
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        if(responseText.message === "Successful")
        {
          this.props.authenticate({
              name: responseText.name,
              email: responseText.email,
              isLoggedIn: true
            });

          this.setState({
                error: '',
                fireRedirect: true
              });
        }
        else
        {
          this.setState({
                error: responseText.message
              });
        }
      })
      .catch((error) => {
          console.error(error);
      });
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  render() {
    return (
      <div className="container-fluid">
          <div className="jumbotron">
              <h1>Please Login</h1>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Email address:</label>
                    <input type="email" className="form-control" onChange={this.handleEmailChange} />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control" onChange={this.handlePasswordChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              <br />
              <p className="text-danger">{this.state.error}</p>
              <p>
                  New User? 
                  <Link to={'/signup'}>Signup</Link>
              </p>
          </div>

          {this.state.fireRedirect && <Redirect to='/dashboard' push={true} />}
      </div>
    );
  }
}