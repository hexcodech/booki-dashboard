import React
       from 'react';

import {connect}
       from 'react-redux';

import RefreshButton
       from 'web/components/RefreshButton';

import CSSModules
       from 'react-css-modules';
import styles
       from './Widget.scss';

const Widget = ({children, lastUpdated, isFetching, handleRefreshClick}) => {
	return (
		<section styleName='widget'>
			<div styleName='content'>
				{children}
			</div>
			<footer styleName='footer'>
				<RefreshButton
          date={lastUpdated}
          loading={isFetching}
          refreshHandler={handleRefreshClick}/>
			</footer>
		</section>
	);
};

export default connect()(CSSModules(Widget, styles));
