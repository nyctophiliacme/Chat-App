import React, { Component } from 'react';
import './css/Dashboard.css';
import plusButton from './images/plus-button.png';
import Channel from './Channel.js';
import Buddy from './Buddy.js';
import AddUser from './AddUser.js';
import CreateChannel from "./CreateChannel";
import MessagesContainer from "./MessagesContainer";
import AddBuddy from "./AddBuddy";
export default class Dashboard extends Component
{
	constructor(props) {
		super(props);
		this.state = {
			channels: [],
			currentChannelOrBuddy: '',
			channelArray: [],
			buddyData: [],
			showAddUser: null,
			showCreateChannel: null,
			showMessagesContainer: null,
			buddies: []
		};
		this.logout = this.logout.bind(this);
		this.channelOrBuddy = null;
		this.changeChannel = this.changeChannel.bind(this);
		this.channelBuddyUtility = this.channelBuddyUtility.bind(this);
		this.fetchChannels = this.fetchChannels.bind(this);
		this.fetchBuddies = this.fetchBuddies.bind(this);
		this.stateHelper = this.stateHelper.bind(this);
		this.handleAddUser = this.handleAddUser.bind(this);
		this.handleCreateChannel = this.handleCreateChannel.bind(this);
		this.handleMessagesContainer = this.handleMessagesContainer.bind(this);
		this.handleAddBuddy = this.handleAddBuddy.bind(this);
		this.currentChannelOrBuddyDesc = null;
		this.channelDescArray = [];
		// this.var = "Hello World";
		// console.log(this.props.user);
	}
	currentChannelOrBuddyDesc = null;
	channelBuddyUtility()
	{
		var temp = [], i, is_selected;
		for(i = 0; i < this.state.channelArray.length; i++)
		{
			if( this.state.currentChannelOrBuddy === this.state.channelArray[i].channelName)
			{
				is_selected = true; 
				this.currentChannelOrBuddyDesc = this.channelDescArray[i].description;
				this.channelOrBuddy = 'channel';
			}
			else
			{
				is_selected = false;
			}
			// console.log(is_selected);
			temp.push(
				<Channel key = {i} 
				onClick = {this.changeChannel.bind(this)} 
				isSelected = {is_selected}
				value = {this.state.channelArray[i].channelName} />);
		}
		this.setState({
			channels: temp
		});
		temp = [];
		for(i = 0; i < this.state.buddyData.length; i++)
		{
			if( this.state.currentChannelOrBuddy === this.state.buddyData[i].email)
			{
				is_selected = true; 
				this.currentChannelOrBuddyDesc = 'You are friends with '+this.state.buddyData[i].name+' ('+this.state.buddyData[i].email+')';
				this.channelOrBuddy = 'buddy';
				this.currentBuddy = this.state.buddyData[i];
			}
			else
			{
				is_selected = false;
			}
			// console.log(is_selected);
			// console.log(this.state.buddyData[i].name);
			temp.push(
				<Buddy key = {i} 
				onClick = {this.changeChannel.bind(this)} 
				isSelected = {is_selected}
				name = {this.state.buddyData[i].name}
				email = {this.state.buddyData[i].email} />);
		}
		// console.log(temp);
		this.setState({
			buddies: temp
		});
	}
	handleMessagesContainer()
	{
		// console.log("Called handleMessagesContainer");
		// console.log(this.state.currentChannelOrBuddy);
		if(this.channelOrBuddy === 'buddy')
		{
			this.setState({
			showMessagesContainer: <MessagesContainer channel = {this.state.currentChannelOrBuddy}
												  description = {this.currentChannelOrBuddyDesc}
												  email = {this.props.user.email}
												  name = {this.props.user.name}
												  channelOrBuddy = {this.channelOrBuddy}
												  currentBuddy = {this.currentBuddy} />
			});
		}
		else if(this.channelOrBuddy === 'channel')
		{
			this.setState({
			showMessagesContainer: <MessagesContainer channel = {this.state.currentChannelOrBuddy}
													  handleAddUser = {this.handleAddUser}
													  description = {this.currentChannelOrBuddyDesc}
													  email = {this.props.user.email}
													  name = {this.props.user.name}
													  channelOrBuddy = {this.channelOrBuddy} />
			});
		}
	}
	changeChannel(val)
	{
		// console.log(val);
		if(this.state.currentChannelOrBuddy !== val)
		{
			this.currentChannelOrBuddyDesc = '';
			this.currentBuddy = '';
			this.setState({
				currentChannelOrBuddy: val
			},
			() => {this.channelBuddyUtility();
				   this.handleMessagesContainer();});
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
				// console.log(responseText.desc);
				
				// this.state.channelArray = responseText.data;
				this.setState({
					channelArray: responseText.data
				})
				this.channelDescArray = responseText.desc;
				this.channelBuddyUtility();
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
	fetchBuddies()
	{
		fetch('/loadBuddies',
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
			console.log(responseText);
			if(responseText.message === "Retrieved Buddies")
			{
				this.setState({
					buddyData: responseText.data
				});
				console.log(this.state.buddyData);
				this.channelBuddyUtility();
			}
			else
	        {
	          	console.log(responseText.message);
	        }
		})
		.catch((error) => 
		{
			console.log("Error in fetching Buddies");
			console.log(error);
		})

	}
	stateHelper()
	{
		this.setState({
			showCreateChannel: null,
			showAddUser: null,
			showAddBuddy: null
		});
	}
	handleCreateChannel()
	{
		this.setState(
		{
			showCreateChannel: (<CreateChannel user={this.props.user} 
				fetchChannels={this.fetchChannels} 
				stateHelper = {this.stateHelper} />)
		});
	}
	handleAddBuddy()
	{
		this.setState({
			showAddBuddy: (<AddBuddy user = {this.props.user}
							stateHelper = {this.stateHelper}/>)
		});
	}
	handleAddUser()
	{
		// console.log(this.var);
		this.setState({
			showAddUser: (<AddUser channel={this.state.currentChannelOrBuddy}  
								   stateHelper = {this.stateHelper}
								   user = {this.props.user}/>)
		});
	}
	componentDidMount()
	{
		this.fetchChannels();
		this.fetchBuddies();
	}
	//*************************************************************************************************
	//*************************************************************************************************
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
						<div className = "sidebar col-sm-2">
							<div className = "welcome">
								Hi, {this.props.user.name}
							</div>
							<div className = "sidebar-heading">
								<span className = "float-left">
									Channels
								</span>
								<img src = {plusButton} onClick={this.handleCreateChannel} className = "image-button float-right"  alt = "Create Channel" />
							</div>
							<div className = "sidebar-container">
								<ul className = "sidebar-nav">
								{this.state.channels}
								</ul>
							</div>
							<div className = "sidebar-heading">
								<span className = "float-left">
									Direct Messages
								</span>
								<img src = {plusButton} onClick={this.handleAddBuddy} className = "image-button float-right"  alt = "Add Buddy" />
							</div>
							<div className = "sidebar-container">
								<ul className = "sidebar-nav">
								{this.state.buddies}
								</ul>
							</div>
						</div>
						{this.state.showMessagesContainer}
					</div>
				</div>  
				{this.state.showAddUser}
				{this.state.showCreateChannel}
				{this.state.showAddBuddy}
			</div>
        );
    }
}
