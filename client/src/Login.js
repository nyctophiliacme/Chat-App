import React, { Component } from 'react';

export default class Login extends Component
{
    state = {
      email: "",
      password: ""
    };
    change = e =>{
      this.setState({
        [e.target.name]: e.target.value
      });
    };
    onSubmit = (e) => {
      e.preventDefault();
      this.setState({
        email: "",
        password: ""
      });
      this.props.onSubmit(this.state);
    }
    render()
    {
        return(
            <form>
              <input
                name = "email"
                placeholder = "email"
                value = {this.state.email}
                onChange = {e => this.change(e)}
              />
              <br/>
              <input
                name = "password"
                type = "password"
                placeholder = "password"
                value = {this.state.password}
                onChange = {e => this.change(e)}
              />
              <br/>
              <button onClick = {e => this.onSubmit(e)}> Submit </button>
            </form>
        );
    }
}
