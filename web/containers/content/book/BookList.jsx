import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import MdAdd from "react-icons/lib/md/add";

import { invalidateBooks, fetchBooksIfNeeded } from "core/actions/book";

import { Table, Tr, Td } from "reactable";
import RefreshButton from "web/components/RefreshButton";
import Actions from "web/components/layout/Actions";
import Card from "web/components/layout/Card";

class BookList extends React.Component {
	componentDidMount = () => {
		const { dispatch, accessToken } = this.props;

		dispatch(fetchBooksIfNeeded(accessToken));
	};

	handleRefreshClick = e => {
		e.preventDefault();

		const { dispatch, accessToken } = this.props;

		dispatch(invalidateBooks());
		dispatch(fetchBooksIfNeeded(accessToken));
	};

	handleBookRowClick = e => {
		this.props.dispatch(
			push("/book/" + e.currentTarget.getAttribute("data-book-id") + "/")
		);
	};

	render = () => {
		const { books } = this.props;

		return (
			<div className="book-list">
				<Actions>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Refresh the book list."
					>
						<RefreshButton refreshHandler={this.handleRefreshClick} />
					</li>
					<li
						className="hint-bottom-middle hint-anim"
						data-hint="Add a new book."
					>
						<Link to={"/book/new/"}>
							<MdAdd />
						</Link>
					</li>
				</Actions>

				<Card>
					<Table
						itemsPerPage={50}
						sortable={true}
						defaultSort={{ column: "ID", direction: "asc" }}
						filterable={["Title"]}
					>
						{books.map((book, index) => {
							return (
								<Tr
									key={index}
									onClick={this.handleBookRowClick}
									data-book-id={book.id}
									data={{ ID: book.id, Title: book.title }}
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
		books: state.app.books
	};
};

export default connect(mapStateToProps)(BookList);
