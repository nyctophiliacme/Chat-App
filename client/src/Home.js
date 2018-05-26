import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class Home extends Component
{
    render() {
		const buttonStyle = {
			marginRight: '1em'
		};
		return (
			<div className="container-fluid">
			    <div className="jumbotron">
			        <h1>Chat-Hub - A simple web app for chatting</h1>
			        <br/>
			        <Link to={`/login`}>
			            <button type="button" className="btn btn-primary btn-lg" style={buttonStyle}>
			                Login
			            </button>
			        </Link>
			        <Link to={`/signup`}>
			            <button type="button" className="btn btn-primary btn-lg" style={buttonStyle}>
			                Signup
			            </button>
			        </Link>
			    </div>
			</div>
		);
	}
}
