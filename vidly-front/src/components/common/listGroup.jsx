import React, { Component } from "react";

class ListGroup extends Component {
	static defaultProps = {
		textProperty: "name",
		valueProperty: "_id",
	};

	render() {
		const { items, textProperty, valueProperty, onItemSelect } = this.props;
		return (
			<div>
				<ul className="list-group">
					{items.map((item) => {
						return (
							<li
								key={item[valueProperty]}
								onClick={() => onItemSelect(item)}
								className={this.getActiveClass(item)}
							>
								{item[textProperty]}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	getActiveClass(item) {
		return `clickable list-group-item ${
			this.props.selectedItem === item ? "active" : ""
		}`;
	}
}

export default ListGroup;
