import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import './css/AddUser.css';
export default class AddUser extends Component 
{
	constructor(props){
		super(props);
		this.state = {
			error: '',
			fireRedirect: false
		};
		this.handleBack = this.handleBack.bind(this);
	}
	handleBack() {
		this.setState({
            fireRedirect: true
        });
	}
	render()
	{
		console.log(this.props.channel);
		return(
			 <div>
			 <div className="container-fluid add-box">
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
		      <div className = "cover">
		      </div>
		      </div>
		);
	}
}