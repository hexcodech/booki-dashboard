import React				from 'react';
import {connect}			from 'react-redux';

import GeneralStats			from 'web/containers/content/dashboard/widgets/GeneralStats.jsx';
import MemoryStats			from 'web/containers/content/dashboard/widgets/MemoryStats.jsx';
import CpuStats				from 'web/containers/content/dashboard/widgets/CpuStats.jsx';
import UserStats			from 'web/containers/content/dashboard/widgets/UserStats.jsx';

const DashboardContent = ({children}) => {
	
	return (	
		<div className='dashboard-content'>
			<GeneralStats />
			<MemoryStats />
			<CpuStats />
			<UserStats />
		</div>
	);
};

export default connect()(DashboardContent);