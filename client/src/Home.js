import React, { Component } from 'react';
import './Home.css';
export default class Home extends Component
{
    render()
    {
        return(
	<div>
		<nav class="navbar navbar-default navbar-static-top">
			<div class="container">
				Hello
			</div>
		</nav>
		<div className="container-fluid">
		  <div className="row content">
		    <div className="col-sm-3 sidenav">
		      <li className="sidebar-brand">
			        Channels
			  </li>
		      <ul className="sidebar-nav">
		        <li><a href="#">Work</a></li>
		        <li><a href="#">Friends</a></li>
		        <li><a href="#">Family</a></li>
		      </ul>
		    </div>
		    <div className="col-sm-9">
		    	Some random text 
		    </div>
		  </div>
		</div>   
	</div>
        );
    }
}
