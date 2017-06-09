import React from "react";
import { Provider } from "react-redux";

import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";

//Containers
import Login from "web/components/auth/Login";
import OAuthCallback from "web/components/auth/OAuthCallback";
import Wrapper from "web/containers/layout/Wrapper";
import Dashboard from "web/containers/content/dashboard/Dashboard";

import UserRouter from "web/containers/content/user/UserRouter";
import ClientRouter from "web/containers/content/client/ClientRouter";
import PersonRouter from "web/containers/content/person/PersonRouter";
import ConditionRouter from "web/containers/content/condition/ConditionRouter";
import BookRouter from "web/containers/content/book/BookRouter";
import ThumbnailTypeRouter from "web/containers/content/thumbnail-type/ThumbnailTypeRouter";
import ImageRouter from "web/containers/content/image/ImageRouter";
import OfferRouter from "web/containers/content/offer/OfferRouter";

const App = ({ store, history }) => {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<div>
					<Route exact path="/" component={Login} />
					<Route path="/auth/callback" component={OAuthCallback} />

					<Wrapper>
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/user" component={UserRouter} />
						<Route path="/client" component={ClientRouter} />
						<Route path="/person" component={PersonRouter} />
						<Route path="/condition" component={ConditionRouter} />
						<Route path="/book" component={BookRouter} />
						<Route path="/thumbnail-type" component={ThumbnailTypeRouter} />
						<Route path="/image" component={ImageRouter} />
						<Route path="/offer" component={OfferRouter} />
					</Wrapper>
				</div>
			</ConnectedRouter>
		</Provider>
	);
};

export default App;
