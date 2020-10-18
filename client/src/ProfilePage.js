import React, {Component} from 'react';
export default class ProfilePage extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			errorDisplay: '',
			userDisplay: ''
		};
		this.checkUserExists = this.checkUserExists.bind(this);
		this.errorDisplay = this.errorDisplay.bind(this);
		this.userDisplay = this.userDisplay.bind(this);
		this.editableUserDisplay = this.editableUserDisplay.bind(this);
		this.editableHandler = this.editableHandler.bind(this);
	}
	checkUserExists()
	{
		const encodedValue = encodeURIComponent(this.props.match.params.email);
		fetch(`/checkUserEmail?email=${encodedValue}`,
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'GET',
			credential: 'same-origin'
		})
		.then((response) => response.text())
		.then((responseText) => {			
			responseText = JSON.parse(responseText);
			console.log("Check User Email exists API response: " + responseText);
			switch(responseText.message)
			{
				case 'No such user exists': this.errorDisplay(responseText.message);	
											break;
				case 'No email-id passed': this.errorDisplay(responseText.message);
											break;
				case 'Found': this.editableHandler(responseText.data);	
											break;
				default: 															
			}
		});
	}
	editableHandler(data)
	{
		console.log(this.props.match.params.email);
		console.log(this.props.user.email);
		if(this.props.user.email === this.props.match.params.email)
			this.editableUserDisplay(data);
		else
			this.userDisplay(data);
	}
	errorDisplay(text)
	{
		this.setState({
			errorDisplay: 
				<div className = "container-fluid">
					<div className = "jumbotron">
						<h3>
							{text}		
						</h3> 
					</div>
				</div>,
			userDisplay: ''
		});
	}
	editableUserDisplay(data)
	{
		console.log("Entered");
		this.setState({
			userDisplay: 
				<div className = "container-fluid">
					<div className = "jumbotron">
						<h3>Editable User Profile</h3>
						<br/>
						<h4>
							Name: {data.name}	
						</h4> 
						<h4>
							Email: {data.email}	
						</h4> 
					</div>
				</div>,
			errorDisplay: ''
		});
	}
	userDisplay(data)
	{
		console.log("Entered here");
		this.setState({
			userDisplay: 
				<div className = "container-fluid">
					<div className = "jumbotron">
						<h3>User Profile</h3>
						<br/>
						<h4>
							Name: {data.name}	
						</h4> 
						<h4>
							Email: {data.email}	
						</h4> 
					</div>
				</div>,
			errorDisplay: ''
		});
	}
	componentDidMount()
	{
		this.checkUserExists();
	}
	render()
	{
		return(
			<div>
				{this.state.errorDisplay}
				{this.state.userDisplay}
			</div>
		);
	}
}
