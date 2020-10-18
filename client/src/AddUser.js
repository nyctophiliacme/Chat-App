import React, { Component } from 'react';
import './css/Add.css';
export default class AddUser extends Component 
{
	constructor(props){
		super(props);
		this.state = {
			error: '',
			email: '',
			successMessage: ''
		};
		this.handleBack = this.handleBack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
	}
	handleSubmit(e)
	{
		e.preventDefault();
		if(this.state.email === this.props.user.email)
		{
			this.setState({
          		successMessage: '',
                error: 'Don\'t enter your own email id'
              });
		}
		else if(this.state.email === '')
		{
			this.setState({
          		successMessage: '',
                error: 'Email id can\'t be left blank'
              });
		}
		else 
		{
			fetch('/addUser',
			{
				headers:
				{
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credentials: 'same-origin',
				body: JSON.stringify({
					email: this.state.email, 
					channelName: this.props.channel
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
				responseText = JSON.parse(responseText);
				console.log("Response of add user" + responseText);
				if(responseText.message === "Successful")
				{
					this.setState({
		                error: '',
		                email: '',
		                successMessage: "Successfully added " + this.state.email + " to " + this.props.channel + " Channel"
		            });
				}
				else
		        {
		          this.setState({
	          		successMessage: '',
	                error: responseText.message
	              });
		        }
			})
			.catch((error) => {
				console.log("Error occurred in add User API" + error);
			});
		}
	}
	handleEmailChange(e) {
		this.setState({
			email: e.target.value
		});
	}
	handleBack() {
		this.props.stateHelper();
	}
	render()
	{
		return(
			 <div>
			 <div className="container-fluid add-box">
		          <div className="jumbotron">
		              <h2>Enter the email-id of the user to be added</h2>
		              <form onSubmit={this.handleSubmit}>
		                <div className="form-group">
		                    <label>Email address:</label>
		                    <input type="email" className="form-control" value = {this.state.email} onChange={this.handleEmailChange} />
		                </div>
		                <button type="submit" className="btn btn-primary">Submit</button>
		                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		                <button type = "button" className = "btn btn-primary" onClick = {this.handleBack} >Back</button>
		              </form>
		              <br />
		              <p className="text-danger">{this.state.error}</p>
		              <p className="text-success">{this.state.successMessage}</p>
		          </div>
		      </div>
		      <div className = "cover">
		      </div>
		      </div>
		);
	}
}