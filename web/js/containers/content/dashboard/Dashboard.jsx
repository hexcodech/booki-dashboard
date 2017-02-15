import React				from 'react';
import {connect}			from 'react-redux';

import GeneralStats			from 'containers/content/dashboard/widgets/GeneralStats.jsx';
import MemoryStats			from 'containers/content/dashboard/widgets/MemoryStats.jsx';
import CpuStats				from 'containers/content/dashboard/widgets/CpuStats.jsx';
import UserStats			from 'containers/content/dashboard/widgets/UserStats.jsx';

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