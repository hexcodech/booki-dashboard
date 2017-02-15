import React				from 'react';
import {connect}			from 'react-redux';

import RefreshButton		from 'components/RefreshButton.jsx';

import Utilities			from 'utilities/Utilities.js';

import {invalidateSystemStats, fetchSystemStatsIfNeeded}	
							from 'actions/SystemStatsActions.js';

class GeneralStatsWidget extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, ["componentDidMount", "handleRefreshClick"]);
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
			<div className="card dynamic">
				<div className="card-block">
					<table className="styled">
						<thead>
							<tr><th>Key</th><th>Value</th></tr>
						</thead>
						<tbody>
							<tr><td>OS</td><td>{systemStats.os}</td></tr>
							<tr><td>Platform</td><td>{systemStats.platform}</td></tr>
							<tr><td>Hostname</td><td>{systemStats.hostname}</td></tr>
							<tr><td>PID</td><td>{systemStats.pid}</td></tr>
							<tr><td>Node Version</td><td>{systemStats.nodeVersion}</td></tr>
							<tr className="seperator"><td colSpan="2">Bandwidth data of the last {systemStats.bandwidth.interval/1000/60} minutes</td></tr>
							<tr>
								<td>Requests served</td>
								<td>{systemStats.bandwidth.requestsServed}</td>
							</tr>
							<tr>
								<td>Data sent</td>
								<td>{Utilities.formatBytes(systemStats.bandwidth.bytesServed / (systemStats.bandwidth.interval/1000) )}/s</td>
							</tr>
							<tr>
								<td>Data received</td>
								<td>{Utilities.formatBytes(systemStats.bandwidth.bytesReceived / (systemStats.bandwidth.interval/1000) )}/s</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="card-footer text-muted">
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

export default connect(mapStateToProps)(GeneralStatsWidget);