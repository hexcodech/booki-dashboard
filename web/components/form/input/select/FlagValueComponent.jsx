import React				from 'react';
import {connect}			from 'react-redux';

import {API_URL}			from 'constants/rest';

const FlagValueComponent = ({value}) => {
	
	let url = API_URL + '/static/res/img/locales/' + value.value + '.svg';
	
	return (
		<span className='flag flag-value'>
			<img src={url} height='20' width='20' />{value.label}
		</span>
	);
};

export default connect()(FlagValueComponent);