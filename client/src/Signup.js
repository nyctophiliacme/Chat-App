import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
export default class Signup extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			error: '',
			fireRedirect: false
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		fetch('/signup',
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify({email: this.state.email, password: this.state.password, name: this.state.name})
		})
		.then((response) => response.text())
		.then((responseText) => {
		responseText = JSON.parse(responseText);
		if(responseText.message === "Successful")
		{
			this.props.authenticate({
				name: this.state.name,
				email: this.state.email,
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
		    console.log(responseText.extra);
		}
		})
		.catch((error) => {
		  console.error(error);
		});
	}

	handleNameChange(e) {
		this.setState({
			name: e.target.value
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
    render()
    {
        return(
			<div className="container-fluid">
			    <div className="jumbotron">
			        <h2>Please Signup</h2>
			        <form onSubmit={this.handleSubmit}>
			            <div className="form-group">
				            <label>Name:</label>
				            <input type="text" className="form-control" onChange={this.handleNameChange} />
				        </div>
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
			            Already have an account? &nbsp;
			            <Link to={'/login'}>Login</Link>
			        </p>
			    </div>

			    {this.state.fireRedirect && <Redirect to='/dashboard' push={true} />}
			</div>
        );
    }
}
