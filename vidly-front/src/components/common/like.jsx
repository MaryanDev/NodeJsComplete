import React from "react";

const Like = ({ isFavorite, onFavoriteClick }) => {
	return (
		<div>
			<i
				onClick={onFavoriteClick}
				className={`clickable fa fa-heart${!isFavorite ? "-o" : ""}`}
				aria-hidden="true"
			></i>
		</div>
	);
};

export default Like;
