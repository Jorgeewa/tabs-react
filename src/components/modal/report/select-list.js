import React from 'react';

export default (props) => {
		let options = [<option key="null"></option>];

		props.data.map((data)=>{
				options.push(<option key={data.id != null ? data.id : data } value={data.id != null ? data.id : data }>
				{data.id != null ? `round ${data.from} ${data.to}` : data }
				</option>)
		});
		return (
			<div className="form-group">
				<label htmlFor="sel1">
					{props.label}
				</label>
				<select
					className="form-control"
					id="sel1"
					{...props.input}
				  >
					{options}

				</select>
			</div>
		 );
	}