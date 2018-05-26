import React, { Component } from 'react';
import './css/Dashboard.css';
import plusButton from './images/plus-button.png';
import { Link } from 'react-router-dom';
export default class Dashboard extends Component
{
	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		console.log(this.props.user);
	}
	logout(e) {
		e.preventDefault();
		this.props.authenticate({isLoggedIn: false});
	}
	channelAdd = () => {
  		console.log('Click!!!!');
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
								<span className = "float-left">
									Channels
								</span>
								<Link to={`/dashboard/createChannel`}>
									<img src = {plusButton} className = "image-button float-right"  alt = "Add" />
								</Link>
							</div>
							<div className = "">
							</div>
						</div>
						<div className = "messages-container col-sm-10">
							Messages
						</div>
					</div>
				</div>   
			</div>
        );
    }
}
