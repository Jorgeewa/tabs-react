import React, {Component} from 'react';
import GridLoader from '../spinners/grid-loader';
import _ from 'lodash';
import Chart from './Chart';
import styled from 'styled-components';

const ChartChildGrid = styled.div`
	background-color: white;
	padding: 5px;
	margin: 5px;
	height: 100%;
`;

const ChartHolderHeader = styled.div`
	width: 100%;
	border-top: 2px solid;
	border-left: 2px solid;
	border-right: 2px solid;
	height: ${props => props.position.h > 1 ? '5%' : '10%' };
`;


const ChartHolderBody = styled.div`
	width: 100%;
	border: 2px solid;
	height: ${props => props.position.h > 1 ? '95%' : '90%' };
`;

let dragId = null;

class ChartHolder extends Component {
	componentDidMount(){
		this.props.loadData({
			observableName: this.props.observableName,
			typeOfChart: this.props.typeOfChart,
			roundId: this.props.roundId
		})
	}
	render() {
		return(
			<ChartChildGrid>
				<ChartHolderHeader
					position={this.props.position}
				>
					{this.props.observableName}
					<span
						onClick={()=>this.props.handleRemoveChart(this.props.id)}
						className="close-tab"
					> 
							&times;
					</span>
				</ChartHolderHeader>
				<ChartHolderBody
					position={this.props.position}
				>
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
				</ChartHolderBody>
			</ChartChildGrid>
		);
	}
}

export default ChartHolder;