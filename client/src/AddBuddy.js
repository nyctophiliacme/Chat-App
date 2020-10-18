import React, { Component } from 'react';
import './css/Add.css';
export default class AddBuddy extends Component 
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
		fetch('/addBuddy',
		{
			headers:
			{
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify({
				email1: this.props.user.email,
				email2: this.state.email,
				name1: this.props.user.name 
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			responseText = JSON.parse(responseText);
			console.log("Response text for add buddy: " + responseText);
			if(responseText.message === "Successful")
			{
				this.setState({
	                error: '',
	                email: '',
	                successMessage: "Successfully added " + responseText.buddyName + " as your buddy"
	            });
			}
			else
	        {
	          this.setState({
          		successMessage: '',
          		email: '',
                error: responseText.message
              });
	        }
		})
		.catch((error) => {
			console.log("Error occurred in adding buddy:" + error);
		});
	}
	handleEmailChange(e) {
		this.setState({
			email: e.target.value
		});
	}
	handleBack() {
		this.props.stateHelper();
		this.props.fetchBuddies();
	}
	render()
	{
		return(
			 <div>
			 <div className="container-fluid add-box">
		          <div className="jumbotron">
		              <h2>Enter the email-id of your buddy</h2>
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