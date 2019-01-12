import React, { Component } from 'react';
import Tab from '../components/tab';
import TabContent from '../components/tab-content';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getTabs} from '../actions/index';
import {bindActionCreators} from 'redux';
import axios from 'axios';

class Tabs extends Component {
	
	constructor(props){
		super(props);

		this.state = {
			currentActiveKey: 0,
			tabArray: [],
			tabName: [],
			tabId: [],
			showTabs: [], //remember to change this
			tabWidth: 0,
			rowWidth: 0,
			saved: false
		};
		
		this.setActive = this.setActive.bind(this);
		this.setTabNumber = this.setTabNumber.bind(this);
		this.hideTab = this.hideTab.bind(this);
		this.addNewTab = this.addNewTab.bind(this);
	}
	
	componentDidMount () {
		let { clientWidth } = this.refs.tab_row;
		this.setState({
			rowWidth: clientWidth
		});
		this.props.getTabs();
		//this.calculateTabWidth(clientWidth);
	}
	
	componentDidUpdate(prevProps){
		if(this.state.tabArray.length == 0){
			let { clientWidth } = this.refs.tab_row;
			const id = this.props.tabs.map((name)=>{
				return name.tab.id;
			});
			const name = this.props.tabs.map((name)=>{
				return name.tab.name;
			});	
			this.setState({
				tabArray: id,
				tabName: name,
				tabId: id,
				showTabs: [true, true, true], //remember to change this
				rowWidth: clientWidth
			}, this.calculateTabWidth.bind(this, clientWidth));
		}
	}
	setTabNumber(number){
		this.setState({
			tabNumber: number
		});
	}
	
	setActive (key){
		if(this.state.currentActiveKey != key){
			this.setState({
				currentActiveKey: key 
			});
		}
	}
	
	hideTab(key){
		let showTabs = this.state.showTabs;
		showTabs[key] = false;
		this.setState({
			showTabs: showTabs
		});
		this.calculateTabWidth(this.state.rowWidth);
	}
	
	addNewTab(){
		
		let tabArray = this.state.tabArray;
		if(this.state.showTabs.filter((element)=>{return element == true}).length >= 10){
			return;
		}
		let showTabs = this.state.showTabs;
		let name = this.state.tabName;
		tabArray.push(this.state.tabArray.length);
		showTabs.push(true);
		name.push('Untitled');
		this.setState({
			tabArray: tabArray,
			showTabs: showTabs,
			tabName: name,
			currentActiveKey: this.state.tabArray.length - 1
		});
		this.calculateTabWidth(this.state.rowWidth);
	}
	
	calculateTabWidth(rowWidth){
		let tabLength = this.state.showTabs.filter((element)=>{return element == true}).length;
		let tabWidth = rowWidth - (tabLength * 10) - 80;
		tabWidth = tabWidth/tabLength;
		this.setState({
			tabWidth: tabWidth
		});
		
	}
	
	onDragEnd = result =>{
		const {destination, source, draggableId} = result;
		if(!destination){
			return;
		}
		
		if(
			destination.droppableId === source.droppableId && 
			destination.index === source.index
		){
			return;
		}
		
		const column = source.droppableId;
		let tabs = this.state.tabArray;
		let visibility = this.state.showTabs;
		let name = this.state.tabName;
		let valueTab = tabs[source.index];
		let valueVisible = visibility[source.index];
		let valueName = name[source.index];
		
		tabs.splice(source.index, 1);
		visibility.splice(source.index, 1);
		name.splice(source.index, 1);
		
		tabs.splice(destination.index, 0, valueTab);
		visibility.splice(destination.index, 0, valueVisible);
		name.splice(destination.index, 0, valueName);
		
		this.setState({
			tabArray: tabs,
			showTabs: visibility,
			tabName: name
		});
	}
	
	onSaveTabs = () => {
		let url = `http://localhost:8181/report/save-tab-data`;
		let tabs = JSON.stringify(this.props.tabs);
		const data = new FormData();
		data.append('tabs', tabs);
		axios.post(url, data)
		     .then(res => {
				this.setState({
					saved: true,
				});
			})
			.catch(error => {
			console.log(error);
		});
	}
	
	render(){
		let tabs = this.state.tabArray.map((tabIndex, visibilityIndex)=>{
			return (
				<Tab 
					key={tabIndex}
					uniqueKey={tabIndex}
					keyNumber={visibilityIndex} 
					onClickTab={this.setActive} 
					activeKey={this.state.currentActiveKey}
					onClickClose={this.hideTab}
					onSaveTabs={this.saveTabs}
					visibility = {this.state.showTabs[visibilityIndex]}
					tabWidth = {this.state.tabWidth}
					rowWidth = {this.state.rowWidth}
					name= {this.state.tabName[visibilityIndex]}
				/>
			);
		})
		return (
			
			<div className="row">
				<DragDropContext
					onDragEnd={this.onDragEnd}
				>
					<div className="tab-row" ref="tab_row" style={{width: "100%"}}>
						<Droppable droppableId='tabs' direction="horizontal">
							{(provided)=>(
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className="test-this-chit"
								>
									{tabs}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
							<div className="add-tab" onClick={()=>this.addNewTab()}>
								&#43;
							</div>
							<div className={this.state.saved == true ? 'glyphicon save-tab glyphicon-floppy-saved' :'glyphicon save-tab glyphicon-floppy-remove'} onClick={()=>this.onSaveTabs()}>
							</div>
					</div>
				</DragDropContext>
				<TabContent activeTab={this.state.currentActiveKey} data={this.props.tabs} tabDetails={{"id":this.state.currentActiveKey, "name":this.state.tabName[this.state.currentActiveKey]}}/>
			</div>
		);
	}
}


function mapStateToProps(state){
	return {
		tabs: state.tabs
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		getTabs: getTabs,
	}, dispatch);
}
	


export default connect(mapStateToProps, mapDispatchToProps)(Tabs);