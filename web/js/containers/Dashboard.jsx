import React		from 'react';
import {connect}	from 'react-redux';

import Sidebar		from './Sidebar.jsx';

const Dashboard = ({children}) => {
	
	return (
		<div className="dashboard row">
			<div className="hidden-sm-down col-md-4 col-lg-3 sidebar-wrapper">
				<Sidebar />
			</div>
			<div className="col-xs-12 col-md-8 col-lg-9 offset-md-4 offset-lg-3">
				{children}
			</div>
		</div>
	);
};

export default connect()(Dashboard);