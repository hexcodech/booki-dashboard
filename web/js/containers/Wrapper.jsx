import React		from 'react';
import {connect}	from 'react-redux';

import DevTools		from './DevTools.jsx';
import Notifications
					from './Notifications.jsx';

const Wrapper = ({children}) => {
	
	return (
		<div className="wrapper">
			{children}
			<Notifications />
			<DevTools />
		</div>
	);
};

export default connect()(Wrapper);