import React from "react";

const Select = ({ name, label, values, error, ...rest }) => {
	return (
		<div className="form-group">
			<label htmlFor={name}>{label}</label>

			<select {...rest} className="form-control" name={name} id={name}>
				{values.map((v, i) => {
					return (
						<option key={i} value={v._id}>
							{v.name}
						</option>
					);
				})}
			</select>
			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};

export default Select;
