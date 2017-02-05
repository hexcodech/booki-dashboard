import React				from 'react';
import {connect}			from 'react-redux';

const FlagOptionComponent = ({value}) => {
	
	let url = "/img/language-flags/" + value.value + ".svg";
	
	return (
		<span className="flag flag-value">
			<img src={url} height="20" width="20" />{value.label}
		</span>
	);
};

export default connect()(FlagOptionComponent);