import React, { Component } from 'react';
export default class CreateChannel extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			channelName: '',
			description: '',
			error: '',
			fireRedirect: false
		};
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleBack = this.handleBack.bind(this);
	}
	handleSubmit(e)
	{
		// console.log(this.props.user);
		// console.log(this.state);
		e.preventDefault();
		fetch('/createChannel',
		{
			headers:
			{
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify({
				email: this.props.user.email, 
				channelName: this.state.channelName,
				description: this.state.description
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			responseText = JSON.parse(responseText);
			// console.log(responseText);
			if(responseText.message === "Successful")
			{
				// this.setState({
	   //              error: '',
	   //              fireRedirect: true
	   //          });
	            this.props.fetchChannels();
	            this.props.stateHelper();
			}
			else
	        {
	          this.setState({
	                error: responseText.message
	              });
	        }
		})
		.catch((error) => {
			console.log(error);
		});
	}
	handleNameChange(e) {
		this.setState({
			channelName: e.target.value
		});
	}
	handleDescriptionChange(e) {
		this.setState({
			description: e.target.value
		})
	}
	handleBack() {
		this.props.stateHelper();
		// this.setState({
  //           fireRedirect: true
  //       });
	}
	render()
    {
        return(
        	<div>
			<div className="container-fluid add-box">
			    <div className="jumbotron">
			        <h2>Please enter name of the channel</h2>
			        <form onSubmit={this.handleSubmit}>
			            <div className="form-group">
				            <label>Name:</label>
				            <input type="text" className="form-control" onChange={this.handleNameChange} />
				            <label>Description:</label>
				            <input type="text" className="form-control" onChange={this.handleDescriptionChange} />
				        </div>
				        <button type="submit" className="btn btn-primary">Create</button>
				        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				        <button type="button" className = "btn btn-primary" onClick = {this.handleBack} >Back</button>
			        </form>
			        <br />
			        <p className="text-danger">{this.state.error}</p>
			    </div>
			</div>
			<div className = "cover">
			</div>
		</div>
        );
    }
}