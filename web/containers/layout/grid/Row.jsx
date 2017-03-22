import React
       from 'react';
import {connect}
       from 'react-redux';

import CSSModules
      from 'react-css-modules';
import styles
      from './Row.scss';

const Row = ({children}) => {
	return (
		<section className='row'>
			{children}
		</section>
	);
};

export default connect()(CSSModules(Row, styles));
