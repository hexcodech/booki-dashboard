import React				from 'react';
import {connect}			from 'react-redux';

import GeneralStats			from './widgets/GeneralStats.jsx';
import MemoryStats			from './widgets/MemoryStats.jsx';
import CpuStats				from './widgets/CpuStats.jsx';
import UserStats			from './widgets/UserStats.jsx';

const DashboardContent = ({children}) => {
	
	return (	
		<div className="dashboard-content">
			<GeneralStats />
			<MemoryStats />
			<CpuStats />
			<UserStats />
		</div>
	);
};

export default connect()(DashboardContent);