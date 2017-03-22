import React
       from 'react';
import {connect}
       from 'react-redux';
import {Link}
       from 'react-router-dom';

import CSSModules
       from 'react-css-modules';
import styles
       from './SidebarListElement.scss';

const SidebarElement = ({text, icon, url, active}) => {

	return (
		<li styleName={active ? 'list-item-active' : 'list-item'}>
			<div styleName='wrapper'>
				<i className='material-icons'>{icon}</i>
				<Link to={url}>
					{text}
				</Link>
			</div>
		</li>
	);
};

const mapStatesToProps = (state, props) => {

	return {
		active: state.router.location.pathname === props.url
	};
};

export default connect(mapStatesToProps)(CSSModules(SidebarElement, styles));
