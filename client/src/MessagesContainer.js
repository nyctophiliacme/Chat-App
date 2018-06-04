import React, { Component } from 'react';	
import plusButtonDark from './images/plus-button-dark.png';
import './css/Messages.css';
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3005');
const io = require('socket.io-client');  
const socket = io.connect('http://localhost:3000');
const options = {year: 'numeric', month: 'long', day: 'numeric' };
export default class MessagesContainer extends Component
{
	constructor(props)
	{
		// console.log("Called everytime");
		super(props);
		this.state = {
			message: '',
			displayMessages: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
		this.socketEnterRoom = this.socketEnterRoom.bind(this);
		this.socketLeaveRoom = this.socketLeaveRoom.bind(this);
		this.handleSocketData = this.handleSocketData.bind(this);
		this.globalCounter = 0;
		this.prevMessageInfo = {
			email: '',
			name: '',
			date: '',
			time: ''
		};
	}
	loadMessages()
	{
		var textBox = document.getElementsByClassName("text-box")[0];
		textBox.disabled = true;
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
			var prevEmail = "", prevDate = "", date, time, dateDisplay, dateExact;
			if(responseText.data.length > 0)
			{
				for(var i = 0; i < responseText.data.length; i++)
				{
					// console.log(responseText.data[i].message +"----->"+ responseText.data[i].date);
					date = new Date(responseText.data[i].date);
					time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
					dateDisplay = date.toLocaleDateString('en-US',options);
					dateExact = date.toLocaleDateString();
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
				this.globalCounter = i;

				// console.log(responseText.data[this.globalCounter-1]);
				date = new Date(responseText.data[this.globalCounter-1].date);
				time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
				dateDisplay = date.toLocaleDateString('en-US',options);

				this.prevMessageInfo = {
					email: responseText.data[this.globalCounter-1].email,
					date: dateDisplay
				};
				// console.log(this.prevMessageInfo);
				// console.log(this.prevMessageInfo.date);
				this.setState({
					displayMessages: temp
				});
				var element = document.getElementById("message-box-id");
	    		element.scrollTop = element.scrollHeight;
    		}
    		textBox.disabled = false;
			// console.log(responseText);
		})
		.catch((error) => {
			console.error(error);
		});
		
	}
	socketEnterRoom()
	{
		socket.emit('subscribe', this.props.channel);
	}
	socketLeaveRoom(x)
	{
		socket.emit('unsubscribe', x);
	}
	componentDidMount()
	{
		// console.log("In componentDidMount");

		this.loadMessages();
		this.socketEnterRoom();
		this.handleSocket();
	}
	componentWillUnmount()
	{
		this.socketLeaveRoom(this.props.channel);
	}

	handleSocketData(data)
	{
		var date = new Date(data.date);
		var time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
		var dateDisplay = date.toLocaleDateString('en-US',options);
		var temp = null;

		// console.log(data);
		// console.log("*************************************");
		// console.log(this.prevMessageInfo);


		// console.log(this);
		if(dateDisplay !== this.prevMessageInfo.date)
		{
			temp = 
				<div key = {-this.globalCounter-1} className = "message-date">
					<span>
						{dateDisplay}
					</span>
				</div>	;
		}	
		if(temp)
		{
			// console.log(temp);
			this.setState({
				displayMessages: [...this.state.displayMessages, temp]
			});
		}
		temp = null;

		if(data.email === this.prevMessageInfo.email)
		{
			temp = (<div className = "message-element" key = {this.globalCounter}>
							{data.message}
						</div>);
		}
		else
		{
			temp = (<div className = "message-element-with-data message-element" key = {this.globalCounter}>
						<span className = "message-element-name">
							{data.name}
						</span>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<span className = "message-element-time">
							{time}
						</span>
						<br/>
						{data.message}
			</div>);
		}
		if(temp)
		{
			// console.log(temp);
			this.setState({
				displayMessages: [...this.state.displayMessages, temp]
			});
		}
		
		var element = document.getElementById("message-box-id");
    	element.scrollTop = element.scrollHeight;
		
		this.globalCounter++;

		this.prevMessageInfo = {
			email: data.email,
			date: dateDisplay
		};
	}

	handleSocket()
	{
		socket.on('message', this.handleSocketData );
	}
	componentDidUpdate(prevProps)
	{
		if(prevProps.channel !== this.props.channel)
		{
			this.setState({
				displayMessages: ''
			});
			// console.log("In componentDidUpdate");
			this.loadMessages();
			this.socketLeaveRoom(prevProps.channel);
			this.socketEnterRoom();
		}
	}
	handleSubmit(e)
	{
		e.preventDefault();
		if(this.state.message !== '')
		{
			socket.emit('send', { 
				channelName: this.props.channel, 
				message: this.state.message,
				name: this.props.name,
				email: this.props.email 
			});
			this.setState({
				message: ''
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
					   <input type="text" placeholder = "Type your message here" className="form-control text-box" value = {this.state.message} onChange = {this.handleMessageChange}/>
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