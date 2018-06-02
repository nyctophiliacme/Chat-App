import React, { Component } from 'react';	
import plusButtonDark from './images/plus-button-dark.png';
import './css/Messages.css';
export default class MessagesContainer extends Component
{
	constructor(props)
	{
		console.log("Called everytime");
		super(props);
		this.state = {
			message: '',
			displayMessages: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
	}
	loadMessages()
	{
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
			responseText = JSON.parse(responseText);
			var temp = [];
			var prevEmail = "";
			var prevDate = "";
			for(var i = 0; i < responseText.data.length; i++)
			{
				// console.log(responseText.data[i].message +"----->"+ responseText.data[i].date);
				var date = new Date(responseText.data[i].date);
				var time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

				var options = {year: 'numeric', month: 'long', day: 'numeric' };
				var dateDisplay = date.toLocaleDateString('en-US',options);
				var dateExact = date.toLocaleDateString();
				if(prevDate !== dateExact)
				{
					temp.push(
						<div key = {-i-1} className = "message-date">
							<span>
								{dateDisplay}
							</span>
						</div>	);
					prevDate = dateExact;
					prevEmail = "";
				}	
				if(prevEmail === responseText.data[i].email)
				{
					temp.push(<div className = "message-element" key = {i}>
									{responseText.data[i].message}
								</div>);
				}
				else
				{
					temp.push(<div className = "message-element-with-data message-element" key = {i}>
								<span className = "message-element-name">
									{responseText.data[i].name}
								</span>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<span className = "message-element-time">
									{time}
								</span>
								<br/>
								{responseText.data[i].message}
					</div>);
					prevEmail = responseText.data[i].email;
				}
				
			}
			this.setState({
				displayMessages: temp
			});
			var element = document.getElementById("message-box-id");
    		element.scrollTop = element.scrollHeight;
			console.log(responseText);
		})
		.catch((error) => {
			console.error(error);
		});
		
	}
	componentDidMount()
	{
		console.log("In componentDidMount");
		this.loadMessages();
	}
	componentDidUpdate(prevProps)
	{
		if(prevProps.channel !== this.props.channel)
		{
			this.setState({
				displayMessages: ''
			});
			console.log("In componentDidUpdate");
			this.loadMessages();
		}
	}
	handleSubmit(e)
	{
		e.preventDefault();
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
				responseText = JSON.parse(responseText);
				if(responseText.message === "Successful")
				{
					this.setState({
						message: ''
					});
					this.loadMessages();
				}
				else
				{
					alert("Can not send message");
					
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
					<div className = "message-box-spacer">
					</div>
					<div className = "message-box-main" id = "message-box-id">
						{this.state.displayMessages}
					</div>
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