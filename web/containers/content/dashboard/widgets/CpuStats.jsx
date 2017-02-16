import React				from 'react';
import {connect}			from 'react-redux';
import {Doughnut}			from 'react-chartjs-2';

import {bindAll}			from 'utilities/object';

import {invalidateSystemStats, fetchSystemStatsIfNeeded}	
							from 'actions/system-stats';
							
import RefreshButton		from 'web/components/RefreshButton.jsx';

class CpuStatsWidget extends React.Component{
	
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
		
		let labels = [], data = [], colors = ['#FFE7C5', '#FFD69B', '#FFC676', '#DEA14B', '#BF7F26'];
		
		for(let key in systemStats.cpuAverage){
			labels.push(key);
			data.push(systemStats.cpuAverage[key]);
			
			/*switch(key){
				case 'user':
					colors.push('#f39c12');
					break;
				case 'nice':
					colors.push('#e74c3c');
					break;
				case 'sys':
					colors.push('#c0392b');
					break;
				case 'idle':
					colors.push('#2ecc71');
					break;
				case 'irq':
					colors.push('#34495e');
					break;
				default:
					colors.push('#000');
					break;
			}*/
		}
		
		const cpuTotal = data.reduce((a, b) => a+b, 0);
		
		return (
			<div className='card dynamic'>
				<div className='card-block'>
					<Doughnut
						data={
							{
								labels: labels,
							    datasets: [
							        {
							            data: data,
							            backgroundColor: colors,
							            hoverBackgroundColor: colors
							        }
							    ]
							}
						}
						width={300}
						height={200}
						options={
							{
								title: {
									text: 'CPU',
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
										    Math.round(data.datasets[0].data[tooltip.index] / cpuTotal * 100) + '%)';
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

export default connect(mapStateToProps)(CpuStatsWidget);