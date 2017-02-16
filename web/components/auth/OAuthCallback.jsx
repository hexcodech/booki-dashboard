import React				from 'react';
import {connect}			from 'react-redux';
import {push}				from 'react-router-redux';

import {getParameterByName}	from 'utilities/location';

import {fetchUser, fetchAccessToken}
							from 'actions/auth';

class OAuthCallback extends React.Component{
	
	componentDidMount(){
		
		this.props.dispatch(
			fetchAccessToken(
				getParameterByName('code')
			)
		).then((accessToken) => {
			
			this.props.dispatch(
				fetchUser(accessToken)
			).then(() => {
				this.props.dispatch(
					push('/dashboard/')
				);
			});
		});
		
		
	}
	
	
	render(){
		return (
			<div className='wrapper pattern-background max-block'>
				<div className='spinner-full-screen'>
					<div className='spinner'>
						<div className='rect1'></div>
						<div className='rect2'></div>
						<div className='rect3'></div>
						<div className='rect4'></div>
						<div className='rect5'></div>
					</div>
					<p className='text-center'>
						Retrieving your data...
					</p>
				</div>
			</div>
		);
	}
	
};

export default connect()(OAuthCallback);