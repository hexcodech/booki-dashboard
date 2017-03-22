import React
       from 'react';
import {connect}
       from 'react-redux';

import CSSModules
      from 'react-css-modules';
import styles
      from './Column.scss';

const Column = ({grid, children}) => {
	return (
		<div className={grid}>
			{children}
		</div>
	);
};

export default connect()(CSSModules(Column, styles));
