import {
	INIT, ADD_OBSERVABLE, REMOVE_OBSERVABLE, 
	SET_TABS, setTabs, INIT_TAB_DETAILS, SET_ACTIVE_TAB, 
	HIDE_TAB, ADD_NEW_TAB, EXTRACT_CHART_DETAILS, 
	UPDATE_TABS_ON_DROP, UPDATE_CHARTS_ON_DROP, SAVE_ALL_TABS_CLICKED,
	SAVE_ALL_TABS_SUCCESS, SAVE_ALL_TABS_FAILURE, saveAllTabsSuccess,
	saveAllTabsFailure, UPDATE_TAB_NAME, UPDATE_CHART_POSITION
} from '../actions/index';
import { loop, Cmd } from 'redux-loop';
import * as Tabs from '../utils/tabs';
import * as Chart from '../utils/chart';

export default function(state, action){
	let sliceTabArray, sliceTabName = null;
	switch(action.type){
		case INIT:
			return loop (
				{...state},
				Cmd.run(Tabs.fetchTabs, {
					successActionCreator: setTabs,
					failActionCreator: setTabs
				})
			);
		case ADD_OBSERVABLE:
			let newState = Tabs.addObservable(state.tabsDetails, action.payload);
			return {
				...state,
				tabsDetails: newState.tabsDetails,
				currentActiveTabData: newState.currentActiveTabData,
				saved: false
			}
		case REMOVE_OBSERVABLE:
			let tabsDetails = Tabs.removeObservable(state.tabsDetails, action.payload);
			return {
				...state, 
				tabsDetails: tabsDetails.tabsDetails, 
				saved: false, 
				currentActiveTabData : Tabs.getCurrentActiveTabData(tabsDetails.tabsDetails, action.payload.id)
			};
			
		case SET_TABS:
			let initTabs = Tabs.initTabs(action.tabs);
			// maybe use ecmascript 6 destructuring here
			return {...state, 
					tabsDetails: initTabs.tabsDetails, 
				 	currentActiveTabData: initTabs.currentActiveTabData,
					tabArray: initTabs.tabArray,
					tabName: initTabs.tabName,
					saved: initTabs.saved,
					currentActiveKey: initTabs.currentActiveKey
			};
		case SET_ACTIVE_TAB:
			if(!state.tabArray.some( tabId => tabId == action.payload)){
				return state;
			}
			if(state.currentActiveKey != action.payload){
				let currentActiveTabData = Tabs.getCurrentActiveTabData(state.tabsDetails, action.payload);
				return {
					...state, currentActiveKey: action.payload, currentActiveTabData: currentActiveTabData
				}
			} else {
				return state
			}
			
		case HIDE_TAB:
			if(state.tabArray.length == 1){
				return state
			}
			let newStateAfterRemove = Tabs.remove(state, action.payload)
			return {
				...state,
				tabsDetails: newStateAfterRemove.tabsDetails, 
				currentActiveKey: newStateAfterRemove.currentActiveKey, 
				currentActiveTabData: newStateAfterRemove.currentActiveTabData,
				tabArray: newStateAfterRemove.tabArray,
				tabName: newStateAfterRemove.tabName,
				saved: newStateAfterRemove.saved
			}
		case ADD_NEW_TAB:
			let addNewTab = Tabs.add(state)
			return {
				...state, 
				tabArray: addNewTab.tabArray, 
				tabName: addNewTab.tabName, 
				currentActiveKey: addNewTab.currentActiveKey, 
				currentActiveTabData: addNewTab.currentActiveTabData,
				tabsDetails: addNewTab.tabsDetails,
				saved: addNewTab.saved
			}
		case SAVE_ALL_TABS_CLICKED:
			return loop (
				{...state},
				Cmd.run(Tabs.saveAll, {
					successActionCreator: saveAllTabsSuccess,
					failActionCreator: saveAllTabsFailure,
					args: [action.tabs]
				})
			
			);
		case SAVE_ALL_TABS_SUCCESS:
			return {
				...state, saved: true
			}
		case SAVE_ALL_TABS_FAILURE:
			return {
				...state
			}
		case UPDATE_TABS_ON_DROP:
			const newTabArrayOrder = Tabs.move(state.tabArray, action.payload.dragId, action.payload.dropId);
			const newTabNameOrder = Tabs.move(state.tabName, action.payload.dragId, action.payload.dropId);
			return {
				...state, tabName: newTabNameOrder, tabArray: newTabArrayOrder, saved: false
			}
		case UPDATE_CHARTS_ON_DROP:
			const newChartOrder = Chart.reorder(state, action.payload)
			return {
				...state, 
				tabsDetails: newChartOrder.tabsDetails,
				currentActiveTabData: newChartOrder.currentActiveTabData,
				saved: newChartOrder.saved
				
			}
		case UPDATE_TAB_NAME:
			const newTabName = Tabs.changeTabName(state.tabsDetails, state.tabName, action.payload);
			return {
				...state,
				tabName: newTabName.tabName,
				tabsDetails: newTabName.tabsDetails,
				saved: false
			}	
		case UPDATE_CHART_POSITION:
			const  newChartPosition = Tabs.updateChartPosition(state.tabsDetails, action.payload);
			return {
				...state,
				tabsDetails: newChartPosition.tabsDetails,
				currentActiveTabData: newChartPosition.currentActiveTabData,
				saved: false
			}
		default:
			return state
	}
}

