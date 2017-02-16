import React				from 'react';
import {connect}			from 'react-redux';
import {Doughnut}			from 'react-chartjs-2';

import RefreshButton		from 'web/components/RefreshButton.jsx';

import {bindAll}			from 'utilities/object';
import {formatBytes}		from 'utilities/format';

import {invalidateSystemStats, fetchSystemStatsIfNeeded}	
							from 'actions/system-stats';

class MemoryStatsWidget extends React.Component{
	
	constructor(props){
		super(props);
		
		bindAll(this, ['componentDidMount', 'handleRefreshClick']);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		dispatch(fetchSystemStatsIfNeeded(accessToken));
	}
	
	handleRefreshClick(e) {
		e.preventDefault();
		
		const {dispatch, accessToken} = this.props;
		
		dispatch(invalidateSystemStats());
		dispatch(fetchSystemStatsIfNeeded(accessToken));
	}
	
	
	render(){
		
		const {systemStats} = this.props;
		
		return (
			<div className='card dynamic'>
				<div className='card-block'>
					<Doughnut
						data={
							{
								labels: [
							        'Used Heap',
							        'Unused Heap',
							        'Other processes',
							        'Free Memory',
							    ],
							    datasets: [
							        {
							            data: [
							            	systemStats.memoryUsage.heapUsed,
							            	systemStats.memoryUsage.heapTotal - systemStats.memoryUsage.heapUsed,
							            	systemStats.totalMemory - systemStats.freeMemory - systemStats.memoryUsage.rss,
							            	systemStats.freeMemory
							            ],
							            backgroundColor: [
							            	'#FFE7C5',
							            	'#FFD69B',
							            	'#FFC676',
							            	'#BF7F26'
							            ],
							            hoverBackgroundColor: [
							            	'#FFE7C5',
							            	'#FFD69B',
							            	'#FFC676',
							            	'#BF7F26'
							            ]
							        }
							    ]
							}
						}
						width={300}
						height={200}
						options={
							{
								title: {
									text: 'Memory',
									display: true
								},
								maintainAspectRatio: false,
								legend: {
								    position: 'bottom'
							    },
							    tooltips: {
								    callbacks: {
									    label: (tooltip, data) => {
										    return data.labels[tooltip.index] + ' (' +
										    Utilities.formatBytes(data.datasets[0].data[tooltip.index]) + ')';
									    }
								    }
							    }
							}
						}
						/>
				</div>
				<div className='card-footer text-muted'>
					<RefreshButton date={systemStats.lastUpdated} loading={systemStats.isFetching} refreshHandler={this.handleRefreshClick} />
				</div>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		accessToken: state.app.authentication.accessToken.token,
		systemStats: state.app.dashboard.systemStats
	};
}

export default connect(mapStateToProps)(MemoryStatsWidget);