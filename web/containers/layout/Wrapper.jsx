import React
       from 'react';
import {connect}
       from 'react-redux';

import Row
       from 'web/containers/layout/grid/Row';
import Column
      from 'web/containers/layout/grid/Column';

import Sidebar
       from 'web/containers/layout/Sidebar';

import DevTools
       from 'web/containers/dev/DevTools';
import Notifications
       from 'web/containers/Notifications';

const Wrapper = ({children}) => {

	return (
		<Row>
			<Column grid='col-md-4 col-lg-3'>
				<Sidebar />
			</Column>
			<Column grid='col-12 col-md-8 col-lg-9'>
				{children}
			</Column>
			<Notifications />
			<DevTools />
		</Row>
	);
};

export default connect()(Wrapper);
