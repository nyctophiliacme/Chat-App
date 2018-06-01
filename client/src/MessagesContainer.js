import React, { Component } from 'react';	
import plusButtonDark from './images/plus-button-dark.png';
import './css/Messages.css';
export default class MessagesContainer extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			message: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
	}
	loadMessages()
	{
		console.log("Called");
		const encodedValue = encodeURIComponent(this.props.channel);
		fetch(`/getMessage?channelName=${encodedValue}`,
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
			console.log(responseText);
		})
		.catch((error) => {
			console.error(error);
		});
	}
	componentDidMount()
	{
		this.loadMessages();
	}
	handleSubmit(e)
	{
		e.preventDefault();
		this.loadMessages();
		if(this.state.message !== '')
		{
			console.log(this.state.message);
			fetch('/postMessage',
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				credential: 'same-origin',
				body: JSON.stringify({
					email: this.props.email,
					name: this.props.name,
					message: this.state.message,
					channelName: this.props.channel
				})
			})
			.then((response) => response.text())
			.then((responseText) => {
				if(responseText.message === "Successful")
				{
					this.setState({
						message: ''
					});
				}
				else
				{
					alert("Can not send message");
					console.log(responseText);
					console.log(responseText.message);
					console.log(responseText);
				}
			})
			.catch((error) => {
				console.error(error);
			});
		}
		
	}
	handleMessageChange(e)
	{
		this.setState({
			message: e.target.value
		});
	}
	render()
	{
		return(
			<div className = "messages-container col-sm-10">
				<div className = "channel-info">
					<span className = "channel-info-name">
						#{this.props.channel}
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</span> 
					<div className="channel-info-image-div">
			       		<img src = {plusButtonDark} onClick={this.props.handleAddUser} className = "channel-info-image" alt = "Add" />
				    </div>
					
					<br/>
					<span className = "channel-info-desc">
						{this.props.description}
					</span>
					</div>
				<div className = "messages-box">
					Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>
					Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>
					Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>
					Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>
					Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>
					Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>Messages<br/>
				</div>
				<div className = "send-box">
				<form onSubmit = {this.handleSubmit}>
					<div className ="input-group send-box-inner">
					   <input type="text" placeholder = "Type your message here" className="form-control" value = {this.state.message} onChange = {this.handleMessageChange}/>
					   &nbsp;
					   <span className="input-group-btn">
					        <button className="btn btn-primary" type="submit">
					        	Go
					        </button>
					   </span>
					</div>
				</form>
				</div>
			</div>	
		);
	}
} 