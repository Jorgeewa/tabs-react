import React, {Component} from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Modal from '../components/modal/report/modal';
import _ from 'lodash';
import ChartHolder from '../components/charts/chart-holder';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addObservable, removeObservable, tabContentLoaded, chartLoaded, setNewChartDetail, updateChartsOnDrop, chartResized} from '../actions/index';
import styled from 'styled-components';
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

const ChartParentGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: ${props => `repeat(${props.length}, 450px)`};
`;

class TabContent extends Component {
	constructor(props){
		super(props);
		this.state = {
			showModal: false,
			width: null,
			height: 0,
		}
	}
	
	static defaultProps = {
		isDraggable: false,
		isResizable: true,
		rowHeight: 400,
		cols: 2,
	}
	componentDidMount(){
		const {clientWidth} = this.refs.tab_content;
		const padding = 2 * 12;
		this.setState({
			width: (clientWidth - padding)/2,
			height: (this.props.tabsData.currentActiveTabData[0].data.length/2) * 470
		});
		this.props.tabContentLoaded();
	}
	
	openModal = event => {
		this.setState({
			showModal: true
		});
	}
	
	closeModal = event => {
		this.setState({
			showModal: false
		});
	}
	
	handleRemoveChart = index => {
		this.props.removeObservable({index: index, id: this.props.tabsData.currentActiveTabData[0].tab.id});
	}
	
	handleSubmitObservables = (values) => {
		let data = {
					   "observableId": values.observable,
					   "roundId": values.round,
					   "typeOfChart": values['chart-type'],
					   "observableName": values.observable
					};
		this.props.setNewChartDetail({
			roundId: values.round, 
			observableName: values.observable, 
			typeOfChart: values['chart-type']
		});
		this.props.addObservable({
			newData: data, 
			id: this.props.tabsData.currentActiveTabData[0].tab.id, 
			name: this.props.tabsData.currentActiveTabData[0].tab.name
		});
	}
	
	handleDrop = (params) => {
		this.props.updateChartsOnDrop(params);
	}
	
	handleChartResize = (layout) => {
		const id = this.props.tabsData.currentActiveTabData[0].tab.id;
		this.props.chartResized(layout, id);
	}
	
	render(){
		if(!_.isEmpty(this.props.chartData)){
			
			let tabsChartData = this.props.tabsData.currentActiveTabData[0].data;
			let layout = tabsChartData.map((data) => {
				return data.position;
			});
			
			let chartData = tabsChartData.map((data, index)=>{
				return(
					<div key={`${this.props.tabsData.currentActiveTabData[0].tab.id}_${index}`} data-grid={data.position}>	
						<ChartHolder
							id={index}
							tabId={this.props.tabsData.currentActiveTabData[0].tab.id}
							observableId={data.observableId}
							position={data.position}
							observableName={data.observableName}
							typeOfChart={data.typeOfChart}
							roundId={data.roundId}
							width={this.state.width}
							handleRemoveChart={this.handleRemoveChart}
							data={this.props.chartData[`${data.roundId}_${data.observableName}`].data}
							loadData = {this.props.chartLoaded}
							handleDrop = {this.handleDrop}
						/>
					</div>
				);
			});
			return (
					
					<div className="">
						<ContextMenuTrigger id="context-menu" holdToDisplay={-1}>
							<div
								className="tab-content" ref="tab_content"
								style={{height: Math.ceil(tabsChartData.length / 2)* 450}}
							>
								<Modal 
									showModal={this.state.showModal} 
									closeModal={this.closeModal} 
									data={this.props.tabsData.currentActiveTabData[0].data} 
									activeTab={this.props.tabsData.currentActiveKey} 
									tabDetails={{"id":this.props.tabsData.currentActiveTabData[0].tab.id, "name":this.props.tabsData.currentActiveTabData[0].tab.name}} 
									allData={this.props.tabsData.tabsDetails} 
									formParams={this.props.formParams}
									handleSubmitObservables={this.handleSubmitObservables}
								/>
								<ReactGridLayout
									onResizeStop={this.handleChartResize}
									isDraggable=  {false}
									isResizable= {true}
									rowHeight= {400}
									cols= {2}
								>
									{chartData}
								</ReactGridLayout>
							</div>
						</ContextMenuTrigger>
						<ContextMenu id="context-menu">
							<MenuItem onClick={this.openModal}>
								Configure charts
							</MenuItem>
						</ContextMenu>
					</div>
				);
		}  else {
			return 	<div
						ref="tab_content"
						style={{height: this.state.height == 0 ? '100vh' : this.state.height}}
					></div>
		}
	}
}

function mapStateToProps(state){
	return {
		tabsData: state.tabsData,
		formParams: state.formParams,
		chartData: state.chartData
	}
}											
											
function mapDispatchToProps(dispatch){
	return bindActionCreators({
		removeObservable: removeObservable,
		addObservable: addObservable,
		tabContentLoaded: tabContentLoaded,
		chartLoaded: chartLoaded,
		setNewChartDetail: setNewChartDetail,
		updateChartsOnDrop: updateChartsOnDrop,
		chartResized: chartResized,
	}, dispatch);
}
		
export default connect(mapStateToProps, mapDispatchToProps)(TabContent);