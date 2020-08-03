import React from "react";

const SearchBox = ({ value, onChange }) => {
	return (
		<input
			className="form-control my-3"
			type="text"
			name="query"
			placeholder="Search..."
			onChange={(e) => onChange(e.currentTarget.value)}
			value={value}
		/>
	);
};

export default SearchBox;
