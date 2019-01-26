import React, { Component } from 'react';
import Tab from '../components/tab/tab';
import _ from 'lodash';
import {connect} from 'react-redux';
import {init, setActiveTab, hideTab, addNewTab, saveAllTabs, updateTabsOnDrop} from '../actions/index';
import {bindActionCreators} from 'redux';

let dragId = null;
class Tabs extends Component {
	
	constructor(props){
		super(props);

		this.state = {
			tabWidth: 0,
			rowWidth: 0
		};
	}
	
	componentDidMount () {
		this.props.init();
		const {clientWidth} = this.refs.tab_row;
		this.setState({
			rowWidth: clientWidth
		});
		this.calculateTabWidth(clientWidth);
	}
	
	componentDidUpdate (prevProps) {
		if(this.props.tabsData.showTabs != prevProps.tabsData.showTabs){
			this.calculateTabWidth(this.state.rowWidth);
		}
	}
	setActive = (key) => {
		this.props.setActiveTab(key);
	}
	
	hideTab = (key) => {
		this.props.hideTab(key);
	}
	
	addNewTab = () => {
		this.props.addNewTab();
	}
	
	calculateTabWidth = (rowWidth) => {
		let tabLength = this.props.tabsData.tabArray.length;
		tabLength = Math.max(3, tabLength);
		let tabWidth = rowWidth - (tabLength * 10) - 80;
		tabWidth = tabWidth/tabLength;
		this.setState({
			tabWidth: tabWidth
		});
		
	}
	
	onSaveTabs = () => {
		this.props.saveAllTabs(this.props.tabsData.tabsDetails);
	}
		
	handleDragStart = (e, id) => {
		dragId = id;
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

	handleDragDrop = (e, props) => {
		this.props.updateTabsOnDrop({
			dragId: dragId,
			dropId: props.id,
		});
		e.target.style.opacity = '';
	}
	
	render(){
		if(this.props.tabsData.tabsDetails.length != 0){
			let tabs = this.props.tabsData.tabArray.map((tabIndex, index)=>{
				return (
					<Tab 
						key={tabIndex}
						id={tabIndex}
						onClickTab={this.setActive} 
						activeKey={this.props.tabsData.currentActiveKey}
						onClickClose={this.hideTab}
						onSaveTabs={this.saveTabs}
						tabWidth = {this.state.tabWidth}
						rowWidth = {this.state.rowWidth}
						name= {this.props.tabsData.tabName[index]}
						handleDragDropEvents={
							{		
									handleDragStart: this.handleDragStart,
									handleDragEnd: this.handleDragEnd,
									handleDragOver: this.handleDragOver,
									handleDragLeave: this.handleDragLeave,
									handleDragDrop: this.handleDragDrop
							}
						}
					/>
				);
			})
			return (

				<div className="row">
					<div className="tab-row" ref="tab_row" style={{width: "100%"}}>
						<div
							className="test-this-chit"
						>
							{tabs}
						</div>
						<div className= "float-right">
							<div className="add-tab" onClick={()=>this.addNewTab()}>
								&#43;
							</div>
							<div 
							className={this.props.tabsData.saved == true ? 'glyphicon save-tab glyphicon-floppy-saved' :'glyphicon save-tab glyphicon-floppy-remove'} 
							onClick={this.props.tabsData.saved == false ? ()=>this.onSaveTabs() : null }>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return <div ref="tab_row" style={{width: "100%"}}></div>
		}
	}
}


function mapStateToProps(state){
	return {
		tabsData: state.tabsData
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({
		init: init,
		setActiveTab: setActiveTab,
		hideTab: hideTab,
		addNewTab: addNewTab,
		saveAllTabs: saveAllTabs,
		updateTabsOnDrop: updateTabsOnDrop
	}, dispatch);
}
	


export default connect(mapStateToProps, mapDispatchToProps)(Tabs);