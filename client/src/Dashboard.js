import React, { Component } from 'react';
import './css/Dashboard.css';
import plusButton from './images/plus-button.png';
import plusButtonDark from './images/plus-button-dark.png';
import Channel from './Channel.js';
import AddUser from './AddUser.js';
import CreateChannel from "./CreateChannel";
export default class Dashboard extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			channels: [],
			currentChannel: '',
			channelArray: [],
			showAddUser: null,
			showCreateChannel: null
		};
		this.logout = this.logout.bind(this);
		this.changeChannel = this.changeChannel.bind(this);
		this.channelUtility = this.channelUtility.bind(this);
		this.fetchChannels = this.fetchChannels.bind(this);
		this.stateHelper = this.stateHelper.bind(this);
		this.handleAddUser = this.handleAddUser.bind(this);
		this.handleCreateChannel = this.handleCreateChannel.bind(this);
		// console.log(this.props.user);
	}
	channelUtility()
	{
		var temp = [];
		for(var i = 0; i < this.state.channelArray.length; i++)
		{
			var is_selected = this.state.currentChannel === this.state.channelArray[i].channelName;
			// console.log(is_selected);
			temp.push(
				<Channel key = {i} 
				onClick = {this.changeChannel.bind(this)} 
				isSelected = {is_selected}
				value = {this.state.channelArray[i].channelName} />);
		}
		// console.log(temp);
		this.setState({
			channels: temp
		});
	}
	changeChannel(val)
	{
		// console.log(val);
		if(this.state.currentChannel !== val)
		{
			this.setState({
				currentChannel: val
			},
			() => {this.channelUtility()});
		}
	}
	logout(e) {
		e.preventDefault();
		this.props.authenticate({isLoggedIn: false});
	}
	fetchChannels()
	{
		fetch('/loadChannels',
		{
			headers:
			{
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			credentials: 'same-origin',
			body: JSON.stringify({
				email: this.props.user.email
			})
		})
		.then((response) => response.text())
		.then((responseText) => {
			responseText = JSON.parse(responseText);
			if(responseText.message === "Retrieved Channels")
			{
				// console.log(responseText.data);
				// this.state.channelArray = responseText.data;
				this.setState({
					channelArray: responseText.data
				})
				this.channelUtility();
			}
			else
	        {
	          	console.log(responseText.message);
	        }
		})
		.catch((error) => {
			console.log(error);
		});
	}
	stateHelper()
	{
		this.setState({
			showCreateChannel: null,
			showAddUser: null
		});
	}
	handleCreateChannel()
	{
		console.log("asdf");
		this.setState(
		{
			showCreateChannel: (<CreateChannel user={this.props.user} 
				fetchChannels={this.fetchChannels} 
				stateHelper = {this.stateHelper} />)
		});
	}
	handleAddUser()
	{
		console.log("clicked");
		this.setState({
			showAddUser: (<AddUser channel={this.state.currentChannel}  
								   stateHelper = {this.stateHelper}/>)
		});
	}
	componentDidMount()
	{
		this.fetchChannels();
	}
	
    render()
    {
    	return(
			<div className = "main">
				<div className = "container-fluid heading">
					<span className = "heading-title">
						chat hub
					</span>
					<button className="btn btn-primary float-right logout-button" onClick={this.logout}>Logout</button>
				</div>
				<div className = "container-fluid chat-container">
					<div className = "row height-100">
						<div className = "side-bar col-sm-2">
							<div className = "welcome">
								Hi, {this.props.user.name}
							</div>
							<div className = "channel-heading">
								<span className = "temp float-left">
									Channels
								</span>
								<img src = {plusButton} onClick={this.handleCreateChannel} className = "image-button float-right"  alt = "Add" />
							</div>
							<div className = "channel-container">
								<ul className = "sidebar-nav">
								{this.state.channels}
								</ul>
							</div>
						</div>
						<div className = "messages-container col-sm-10">
							{this.state.currentChannel}
							<img src = {plusButtonDark} onClick={this.handleAddUser} className = "image-button float-right"  alt = "Add" />
						</div>
					</div>
				</div>  
				{this.state.showAddUser}
				{this.state.showCreateChannel}
			</div>
        );

    }
}
