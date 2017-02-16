import React				from 'react';
import {connect}			from 'react-redux';
import {Link}				from 'react-router';
import {push}				from 'react-router-redux';

import {bindAll}			from 'utilities/object';

import {invalidateClients, fetchClientsIfNeeded}
							from 'actions/client';

import RefreshButton		from 'web/components/RefreshButton';

class ClientList extends React.Component{
	
	constructor(props){
		super(props);
		
		bindAll(this, ['componentDidMount', 'handleRefreshClick', 'handleClientRowClick']);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		dispatch(fetchClientsIfNeeded(accessToken));
	}
	
	handleRefreshClick(e) {
		e.preventDefault();
		
		const {dispatch, accessToken} = this.props;
		
		dispatch(invalidateClients());
		dispatch(fetchClientsIfNeeded(accessToken));
	}
	
	handleClientRowClick(e){
		this.props.dispatch(
			push('/dashboard/client/' + e.currentTarget.getAttribute('data-client-id') + '/')
		);
	}
	
	render(){
		
		const {clients} = this.props;
		
		return (
			<div className='client-list'>
				<ul className='list-inline list-navigation'>
					<li className='list-inline-item hint-bottom-middle hint-anim' data-hint='Refresh the client list.'>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li className='list-inline-item hint-bottom-middle hint-anim' data-hint='Add a new client.'>
						<Link to={'/dashboard/client/new/'} className='max-block'>
							<i className='material-icons bottom'>add</i>
						</Link>
					</li>
				</ul>
				
				<hr/>
				
				<table className='styled clickable-rows'>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Trusted</th>
						</tr>
					</thead>
					<tbody>
						{clients.map((client, index) => {
							return <tr key={index} onClick={this.handleClientRowClick} data-client-id={client._id}>
								<td>{client._id}</td>
								<td>{client.name}</td>
								<td><span className='rel hint-right-middle hint-anim' data-hint={client.trusted ? 'Trusted' : 'Untrusted'}>{
										client.trusted ?
											<i className='material-icons bottom trusted'>verified_user</i> :
											<i className='material-icons bottom untrusted'>lock_open</i>
									}</span>
								</td>
							</tr>;
						})}
					</tbody>
				</table>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		accessToken	: state.app.authentication.accessToken.token,
		clients		: state.app.clients
	};
}

export default connect(mapStateToProps)(ClientList);