/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import PropTypes from "prop-types";

class Pagination extends Component {
	static propTypes = {
		count: PropTypes.number.isRequired,
		pageSize: PropTypes.number.isRequired,
		currentPage: PropTypes.number.isRequired,
		onPageClick: PropTypes.func.isRequired,
	};

	render() {
		const pages = this.getCountOfPages();
		if (pages === 1) {
			return null;
		}
		return (
			<ul className="pagination pagination-sm">
				{[...Array(pages)].map((elem, index) => {
					const page = index + 1;
					return (
						<li className={this.getActiveClass(page)} key={index}>
							<a
								className="page-link"
								onClick={() => {
									if (this.props.currentPage !== page) {
										this.props.onPageClick(page);
									}
								}}
							>
								{page}
							</a>
						</li>
					);
				})}
			</ul>
		);
	}

	getCountOfPages() {
		const { count, pageSize } = this.props;
		let pages = parseInt(count / pageSize);
		return count % pageSize === 0 ? pages : ++pages;
	}

	getActiveClass(page) {
		return `clickable page-item ${
			page === this.props.currentPage ? "active" : ""
		}`;
	}
}

export default Pagination;
