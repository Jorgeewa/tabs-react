import React, { Component } from 'react';
import {Draggable} from 'react-beautiful-dnd';

class Tab extends Component {
	constructor(props){
		super(props);
		this.state = {
			saved: false
		}
	}
	render(){
		const tabClassName = "tab-bar";
		const activeTab = this.props.activeKey === this.props.uniqueKey ? "active-tab" : "";
		const hideTab = this.props.visibility === false ? "hide" : "";
		return (
				<Draggable
					draggableId={`${this.props.keyNumber}`}

					index={this.props.keyNumber}
				>
					{(provided)=>(

						<div 
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							ref={provided.innerRef}
						>
							<div
								className = {`${tabClassName} ${activeTab} ${hideTab}`}
								onClick={()=>this.props.onClickTab(this.props.uniqueKey)}
								style={{width: this.props.tabWidth}}
							>
								{this.props.name}
								<span
									onClick={()=>this.props.onClickClose(this.props.keyNumber)} 
									className="close-tab"
								> 
										&times;
								</span>
							</div>
						</div>
					)}
				</Draggable>
		);
	}
}


export default Tab;