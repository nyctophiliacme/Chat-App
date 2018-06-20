import React, {Component} from 'react';

export default class GenericNotFound extends Component
{
	render()
	{
		return(
			<div className = "container-fluid">
				<div className = "jumbotron">
					<h3>
						Sorry, That page doesn't exist!
					</h3>
				</div>
			</div>
		);
	}
}