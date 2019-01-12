import React, {Component} from 'react';
import {css} from 'react-emotion';
import { GridLoader } from 'react-spinners';
import Chart from './chart';
import _ from 'lodash';
import axios from 'axios';


const spinner = css`
    display: block;
    margin: 0 auto;
    border-color: red;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
`;

let dragDiv = null;
class ChartHolder extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			loading: true,
			parent: null,
			x: null,
			y: null,
			type: null
		}
	}
	
	toggleOffSpinner = () => {
		this.setState({
			loading: false
		});
	}
	
	componentDidMount(){
		let observableCode = 'past_graphs';
		let url = `http://localhost:8181/report/get-chart-data?roundId=${this.props.roundId}&observableName=${this.props.observableName}&observableCode=${observableCode}`;
		axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }})
		     .then(res => {
                if(res.data.error){
                   return
                }
				let x = JSON.parse(res.data.measurement.split("\n")[0]);
				let y = JSON.parse(res.data.measurement.split("\n")[1]);
				this.setState({
					loading: false,
					x: x,
					y: y
				});
			})
			.catch(error => {
			console.log(error);
		});
		
		//const {clientWidth} = this.refs.tab_content;
	}

	renderRingLoader = () => {
		return(
			<GridLoader
			  className={spinner}
			  sizeUnit={"px"}
			  size={30}
			  color={'#123abc'}
			  loading={this.state.loading}
			/>
		);
	}
	
	handleDragStart = (e) => {
		dragDiv = e.target;
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
	
	handleDragLeave(e){
		e.target.style.opacity='';
	}
	
	handleDragDrop = (e) => {
		let dropDiv = this.refs[`chart_${this.props.id}`];
		let indexOfDragging = Array.from(this.props.parentDiv.children).indexOf(dragDiv);
		let indexOfDropping = Array.from(this.props.parentDiv.children).indexOf(dropDiv);
		if(indexOfDropping != indexOfDragging){
			if(indexOfDragging < indexOfDropping){
				this.props.parentDiv.insertBefore(dragDiv, dropDiv.nextSibling);
			} else {
				this.props.parentDiv.insertBefore(dragDiv, dropDiv);
			}
		}
		e.target.style.opacity = '';
	}

	renderChart = () => {
		
		let time = [
			'0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', 
			'10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', 
			'19:00', '20:00', '21:00', '22:00', '23:00'
		];
		
		let data = [];
		let y = 0
		while(y < 24){
			var rand = Math.floor(Math.random() * 10);
			data.push(rand);
			y++;
		}
		return(
			<Chart
				x={this.state.x}
				y={this.state.y}
				type = {this.state.type}
			    width = {this.props.width}
			/>
		);
	}
	render(){
		return(
			<div
				style={{width: this.props.width}}
				className="chart-holder"
				draggable={true}
				ref={`chart_${this.props.id}`}
				onDragStart={(e)=>this.handleDragStart(e)}
				onDragEnd={(e)=>this.handleDragEnd(e)}
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
					{this.state.loading && this.renderRingLoader()}
					{!this.state.loading && this.renderChart()}
				</div>
			</div>
		);
	}
}

export default ChartHolder;