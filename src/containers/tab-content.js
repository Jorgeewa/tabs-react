import React, {Component} from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Modal from '../components/modal/report/modal';
import _ from 'lodash';
import ChartHolder from '../components/charts/chart-holder';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addObservable, removeObservable, fetchFormParams, fetchChartData, setNewChartDetail, updateChartsOnDrop} from '../actions/index';


class TabContent extends Component {
	constructor(props){
		super(props);
		this.state = {
			showModal: false,
			width: null,
			height: 0,
		}
	}
	componentDidMount(){
		const {clientWidth} = this.refs.tab_content;
		const padding = 2 * 12;
		this.setState({
			width: (clientWidth - padding)/2,
			height: this.props.tabsData.currentActiveTabData[0].data.length/2 * 470
		});
		this.props.fetchFormParams();
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
	
	render(){
		if(!_.isEmpty(this.props.chartData)){
			let chartData = this.props.tabsData.currentActiveTabData[0].data.map((data, index)=>{
				return(
				<ChartHolder
					key={`${this.props.tabsData.currentActiveTabData[0].tab.id}_${index}`}
					id={index}
					tabId={this.props.tabsData.currentActiveTabData[0].tab.id}
					observableId={data.observableId}
					observableName={data.observableName}
					position={data.position}
					typeOfChart={data.typeOfChart}
					roundId={data.roundId}
					width={this.state.width}
					handleRemoveChart={this.handleRemoveChart}
					data={this.props.chartData[`${data.roundId}_${data.observableName}`].data}
					loadData = {this.props.fetchChartData}
					handleDrop = {this.handleDrop}
				/>);
			});
			return (
					
					<div className="">
						<ContextMenuTrigger id="context-menu" holdToDisplay={-1}>
							<div
								className="tab-content" ref="tab_content"
								style={{height: this.state.height == 0 ? '100vh' : this.state.height}}
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
								{chartData}
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
		fetchFormParams: fetchFormParams,
		fetchChartData: fetchChartData,
		setNewChartDetail: setNewChartDetail,
		updateChartsOnDrop: updateChartsOnDrop,
	}, dispatch);
}
		
export default connect(mapStateToProps, mapDispatchToProps)(TabContent);