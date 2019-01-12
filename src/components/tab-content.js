import React, {Component} from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import ModalContent from './modal-content';
import _ from 'lodash';
import ChartHolder from './chart-holder';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {removeObservable} from '../actions/index';
import axios from 'axios';


class TabContent extends Component {
	constructor(props){
		super(props);
		this.state = {
			showModal: false,
			data: [],
			width: null,
			height: 0,
            formParams: {
             rounds: null,
             observables: null,
             chartTypes: null
            }
		}
	}
	componentDidMount(){
		const {clientWidth} = this.refs.tab_content;
		const padding = 2 * 11;
		this.setState({
			width: (clientWidth - padding)/2,
			data: this.props.data[0].data,
			height: this.props.data[0].data.length/2 * 470
		});
       
        let url = `http://localhost:8181/report/get-report-form-params`;
		axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }})
		     .then(res => {
                 this.setState({
                     formParams: res.data
                 });
				})
			.catch(error => {
			console.log(error);
		});
	}
	
	componentDidUpdate(prevProps){
		if(this.props.activeTab != prevProps.activeTab || this.props.data != prevProps.data){
			let dataToDisplay = this.props.data.filter((name)=>{
				return name.tab.id == this.props.activeTab
			});
			let data = [];
			let tabDetails = null;
			if(dataToDisplay[0]){
				data = dataToDisplay[0].data;
				tabDetails = dataToDisplay[0].tab
			}
			this.setState({
				data: data
			});
		}
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
		let updateData = this.state.data.slice();
		updateData.splice(index, 1);
		let newTabContent = {
			"tab": this.props.tabDetails,
			"data": updateData
		}
		/*let tabIndex = this.props.data.findIndex((data)=>{
			 return(data.tab.id === this.props.tabDetails.id)
		});
		
		let newData = this.props.data.slice();
		console.log(newData);
		//newData.splice(tabIndex, 1, newTabContent);
		//console.log([...this.props.data])
		
		//let dat = [ ...this.props.data.splice(tabIndex, 1, newTabContent)];
		console.log(dat);*/
		this.props.removeObservable({index: index, id: this.props.tabDetails.id});
	}
	
	render(){
		let chartData = this.state.data.map((data, index)=>{
			let rand = Math.random();
			return(
			<ChartHolder
				key={index}
				id={index}
				parentDiv={this.refs.tab_content}
				observableId={data.observableId}
				observableName={data.observableName}
				position={data.position}
				typeOfChart={data.typeOfChart}
				roundId={data.roundId}
				width={this.state.width}
				handleRemoveChart={this.handleRemoveChart}
			/>);
		});
		return (
				<div className="">
					<ContextMenuTrigger id="context-menu" holdToDisplay={-1}>
						<div
							className="tab-content" ref="tab_content"
							style={{height: this.state.height == 0 ? '100vh' : this.state.height}}
						>
							<ModalContent showModal={this.state.showModal} closeModal={this.closeModal} data={this.state.data} activeTab={this.props.activeTab} tabDetails={this.props.tabDetails} allData={this.props.data} formParams={this.state.formParams}/>
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
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({removeObservable: removeObservable}, dispatch);
}
		
export default connect(null, mapDispatchToProps)(TabContent);