import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import MdAdd from "react-icons/lib/md/add";

import { invalidateOffers, fetchOffersIfNeeded } from "core/actions/offer";

import { Table, Tr, Td } from "reactable";
import Card from "web/components/layout/Card";
import Actions from "web/components/layout/Actions";
import RefreshButton from "web/components/RefreshButton";

class OfferList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchOffersIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateOffers());
		dispatch(fetchOffersIfNeeded(accessToken));
	};

	handleOfferRowClick = e => {
		this.props.dispatch(
			push("/offer/" + e.currentTarget.getAttribute("data-offer-id") + "/")
		);
	};

	render = () => {
		const { offers } = this.props;

		return (
			<div className="offer-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the offer list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new offer."
					>
						<Link to={"/offer/new/"}>
							<MdAdd />
						</Link>
					</li>
				</Actions>

				<Card>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
						filterable={["Description"]}
					>
						{offers.map((offer, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handleOfferRowClick}
									data-offer-id={offer.id}
									data={{
										ID: offer.id,
										Price: offer.price + " CHF",
										Description: offer.description.substring(0, 50)
									}}
								/>
							);
						})}
					</Table>
				</Card>
			</div>
		);
	};
}

const mapStateToProps = state => {
	return {
		accessToken: state.app.authentication.accessToken.token,
		offers: state.app.offers
	};
};

export default connect(mapStateToProps)(OfferList);
