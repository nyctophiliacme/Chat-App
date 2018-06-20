import React, {Component} from 'react';
export default class ProfilePage extends Component
{
	constructor(props)
	{
		super(props);
		console.log(this.props.match.params.email);
		console.log(this.props);
		
		// console.log(this.props.match.params.id);
	}
	componentDidMount()
	{

	}
	render()
	{
		return(
			<div className = "container-fluid">
				<div className = "jumbotron">
					<h3>
						Hello 		
					</h3> 
				</div>
			</div>
		);
	}
}
