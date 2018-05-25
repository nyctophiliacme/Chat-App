import React, { Component } from 'react';
import './css/Home.css';
export default class Home extends Component
{
    render()
    {
        return(
			<div className = "main">
				<div className = "container-fluid heading">
					Chat-Hub
				</div>
				<div className = "container-fluid chat-container">
					<div className = "row">
						<div className = "side-bar col-sm-3">
							SideBar
						</div>
						<div className = "messages-container col-sm-9">
							Messages
						</div>
					</div>
				</div>   
			</div>
        );
    }
}
