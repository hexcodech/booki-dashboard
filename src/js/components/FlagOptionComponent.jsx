import React				from 'react';
import {connect}			from 'react-redux';

const FlagOptionComponent = ({option, isFocused, onFocus, onSelect}) => {
	
	let url = "/img/language-flags/" + option.value + ".svg";
	
	const
	handleMouseDown		= (event) => {
		event.preventDefault();
		event.stopPropagation();
		
		onSelect(option, event);
	},
	handleMouseEnter	= (event) => {
		onFocus(option, event);
	},
	handleMouseMove	= (event) => {
		if(isFocused){return;}
		onFocus(option, event);
	};
	
	return (
		<div
			className="flag flag-option"
			onMouseDown={handleMouseDown}
			onMouseEnter={handleMouseEnter}
			onMouseMove={handleMouseMove}
		>
			<img src={url} height="20" width="20" />{option.label}
		</div>
	);
};

export default connect()(FlagOptionComponent);