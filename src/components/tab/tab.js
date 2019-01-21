import React, { Component } from 'react';

const Tab = (props) => {
	const tabClassName = "tab-bar";
	const activeTab = props.activeKey === props.id ? "active-tab" : "";
	return (
			<div
				className = {`${tabClassName} ${activeTab}`}
				onClick={()=>props.onClickTab(props.id)}
				style={{width: props.tabWidth}}
				draggable={true}
				onDragStart={e => props.handleDragDropEvents.handleDragStart(e, props.id)}
				onDragEnd={e => props.handleDragDropEvents.handleDragEnd(e)}
				onDragOver={e => props.handleDragDropEvents.handleDragOver(e)}
				onDragLeave={e => props.handleDragDropEvents.handleDragLeave(e)}
				onDrop={e => props.handleDragDropEvents.handleDragDrop(e, props)}
			>
				{props.name}
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