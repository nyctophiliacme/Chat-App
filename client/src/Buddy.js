import React, { Component } from 'react';
export default class Channel extends Component
{
	constructor(props)
	{
		super(props);
		this.handleClickLi = this.handleClickLi.bind(this);
	}
	handleClickLi(e)
	{
		this.props.onClick(this.props.email);
	}
	render()
	{
		// console.log(this.props.value+"*********");
		var liStyle = 
		{
			background: '#9b59b6'
		}
		if(this.props.isSelected)
		{
			liStyle['background'] = '#2c3e50';
		}
		return(
			<li onClick={this.handleClickLi} style = {liStyle}>
				{this.props.name}
			</li>
		);
	}
}