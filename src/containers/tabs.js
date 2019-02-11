import React, { Component } from 'react';
import Tab from '../components/tab/tab';
import _ from 'lodash';
import {connect} from 'react-redux';
import {init, setActiveTab, hideTab, addNewTab, saveAllClicked, updateTabsOnDrop, updateTabName} from '../actions/index';
import {bindActionCreators} from 'redux';
import RGL, { WidthProvider } from "react-grid-layout";
import styled from 'styled-components';

const Center = styled.div `
	justify-self: center;
	align-self: center;
`;

const AddTab = styled.div `
	color: grey;
	border: 1px solid grey;
	width: 100%;
	color: #aaa;
	font-size: 28px;
	font-weight: bold;
	display: grid;
`;


const Save = styled.div `
	width: 100%;
	padding: 5px;
	justify-self: center;
	align-self: center;
`;

const TabsGrid = styled.div `
	display: grid;
	grid-template-columns: 94% 2.5% 2.5% 1%;
	grid-template-rows: repeat(1, 40px);
	column-gap: 10px;
	margin-bottom: 10px;

	&:hover ${Save} {
		cursor: pointer;
	}

	&:hover ${AddTab} {
		cursor: pointer;
	}
`;


const ReactGridLayout = WidthProvider(RGL);

class Tabs extends Component {
	
	componentDidMount () {
		this.props.init();
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
	
	changeTabName = (id) =>(newName) => {
		let params = {
			id: id,
			name: newName.name
		}
		this.props.updateTabName(params);
	}
	
	validateTabName = (name) => {
		return (name.length > 3 && name.length < 15);
	}
	
	onSaveTabs = () => {
		this.props.saveAllClicked(this.props.tabsData.tabsDetails);
	}
		
	handleDragStop = (layout, oldItem, newItem, placeholder) => {
		
		this.props.updateTabsOnDrop(layout, oldItem, this.props.tabsData.position);
	}
	
	render(){
		//I hate the fact that react grid layout forces my ids to strings. Need to find a way around this
		if(this.props.tabsData.tabsDetails.length != 0){
			let tabs = this.props.tabsData.position.map((pos, index)=>{
				return (
					<div key={pos.i} data-grid={pos}>
						<Tab 
							id={pos.i}
							onClickTab={this.setActive} 
							activeKey={this.props.tabsData.currentActiveKey}
							onClickClose={this.hideTab}
							name = {this.props.tabsData.tabName[index]}
							changeTabName = {this.changeTabName}
							validateTabName = {this.validateTabName}
						/>
					</div>
				);
			})
			return (

				<TabsGrid>
					<ReactGridLayout
						onDragStop={this.handleDragStop}
						isDraggable=  {true}
						isResizable= {false}
						rowHeight= {50}
						cols= {Math.max(this.props.tabsData.tabName.length, 4)}
						compactType= {'horizontal'}
					>
						{tabs}
					
					</ReactGridLayout>
					<AddTab 
						onClick={()=>this.addNewTab()}
					>
						<Center>
							&#43;
						</Center>
					</AddTab>
					<Save 
						className={this.props.tabsData.saved == true ? 'glyphicon save-tab glyphicon-floppy-saved' :'glyphicon save-tab glyphicon-floppy-remove'} 
						onClick={this.props.tabsData.saved == false ? ()=>this.onSaveTabs() : null }
					>
					</Save>
					
				</TabsGrid>
			);
		} else {
			return <div></div>
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
		saveAllClicked: saveAllClicked,
		updateTabsOnDrop: updateTabsOnDrop,
		updateTabName: updateTabName
	}, dispatch);
}
	


export default connect(mapStateToProps, mapDispatchToProps)(Tabs);