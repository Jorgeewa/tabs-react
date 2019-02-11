import React, { Component } from 'react';
import InlineEdit from 'react-edit-inline2';

const Tab = (props) => {
	const tabClassName = "tab-bar";
	const activeTab = `${props.activeKey}` === props.id ? "active-tab" : "";
	return (
			<div
				className = {`${tabClassName} ${activeTab}`}
				onClick={()=>props.onClickTab(props.id)}
			>
				<InlineEdit
					validate={props.validateTabName}
					text={props.name}
					paramName="name"
					change={props.changeTabName(props.id)}
					activeClassName="inline-edit"
					style={{
						margin: 0,
						padding: 0,
						outline: 0,
						border: 0
					  }}
				/>
				<span
					onClick={()=>props.onClickClose(props.id)} 
					className="close-tab"
				> 
						&times;
				</span>
			</div>
	);
}

export default Tab;