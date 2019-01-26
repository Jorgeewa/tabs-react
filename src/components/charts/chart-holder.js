import React, {Component} from 'react';
import {css} from 'react-emotion';
import GridLoader from '../spinners/grid-loader';
import Plot from 'react-plotly.js';
import _ from 'lodash';
import Chart from './Chart';

let dragId = null;

class ChartHolder extends Component {
	componentDidMount(){
		this.props.loadData({
			observableName: this.props.observableName,
			typeOfChart: this.props.typeOfChart,
			roundId: this.props.roundId
		})
	}
	handleDragStart = (e) => {
		dragId = this.props.id;
		setTimeout((_this, e)=> e.style.opacity='0.2', 0, this, e.target);
	}
	
	handleDragEnd = (e) => {
		e.preventDefault();
		e.target.style.opacity = '';
	}
		
	handleDragOver = (e) => {
		e.preventDefault();
		e.target.style.opacity = '0.2';
	}
	
	handleDragLeave = (e) => {
		e.target.style.opacity='';
	}
	
	handleDragDrop = (e) => {
		this.props.handleDrop({
			dragId: dragId,
			dropId: this.props.id,
			tabId: this.props.tabId
		});
		e.target.style.opacity = '';
	}
	render() {
		return(
			<div
				style={{width: this.props.width}}
				className="chart-holder"
				draggable={true}
				onDragStart={this.handleDragStart}
				onDragEnd={this.handleDragEnd}
				onDragOver={this.handleDragOver}
				onDragLeave={this.handleDragLeave}
				onDrop={this.handleDragDrop}
			>
				<div 
					className="chart-holder-header"
				>
					{this.props.observableName}
					<span
						onClick={()=>this.props.handleRemoveChart(this.props.id)}
						className="close-tab"
					> 
							&times;
					</span>
				</div>
				<div className="chart-holder-body" >
					{_.isEmpty(this.props.data) && <GridLoader/>}
					{
						!_.isEmpty(this.props.data) && 
						<Chart
							typeOfChart={this.props.typeOfChart}
							data={this.props.data}
							width={this.props.width}
							observableId={this.props.observableId}
						/>
					}
				</div>
			</div>
		);
	}
}

export default ChartHolder;