import React from "react";

import CSSModules from "react-css-modules";
import styles from "./Spinner.scss";

const Spinner = () => {
	return (
		<div>
			<div className="wrapper">
				<div styleName="spinner">
					<div styleName="rect1" />
					<div styleName="rect2" />
					<div styleName="rect3" />
					<div styleName="rect4" />
					<div styleName="rect5" />
				</div>
				<p className="description">
					Loading...
				</p>
			</div>
		</div>
	);
};

export default CSSModules(Spinner, styles);
