import {INIT, ADD_OBSERVABLE, REMOVE_OBSERVABLE, SET_TABS, setTabs, INIT_TAB_DETAILS, SET_ACTIVE_TAB, HIDE_TAB, ADD_NEW_TAB, SAVE_ALL_TABS, EXTRACT_CHART_DETAILS, UPDATE_TABS_ON_DROP, UPDATE_CHARTS_ON_DROP} from '../actions/index';
import { loop, Cmd } from 'redux-loop';
import * as Tabs from '../utils/tabs';

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
			let newTabData = null;
			let index = state.tabsDetails.findIndex((data)=>{
				return(data.tab.id === action.payload.id)
			});
			
			if(index != -1){
				return {
					...state, tabsDetails: 
					[
					...state.tabsDetails.map((data)=>{
						if(data.tab.id === action.payload.id){
							newTabData = {
								"tab": data.tab, "data" : [...data.data, action.payload.newData]
							}
							return newTabData;
						} else {
							return data
						}
					})
					
				], saved: false, currentActiveTabData: [newTabData]
					   };
			} else {
				newTabData = {"tab": {"id": action.payload.id, "name": action.payload.name}, "data": [action.payload.newData]}
				return {
					...state, tabsDetails:
					[...state.tabsDetails, newTabData],
					saved: false, currentActiveTabData: [newTabData]
				};
			}
		case REMOVE_OBSERVABLE:
			let tabsDetails = state.tabsDetails.map((data)=>{
						return data.tab.id === action.payload.id 
						? {
							"tab": data.tab, 
							"data" : [...data.data.slice(0, action.payload.index), ...data.data.slice(action.payload.index + 1)]
						} 
						: data
					});
			return {
				...state, tabsDetails: tabsDetails, saved: false, currentActiveTabData : Tabs.getCurrentActiveTabData(tabsDetails, action.payload.id)
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
			let tabIndex = state.tabArray.findIndex((tabId)=>{ return tabId == action.payload});
			sliceTabArray = state.tabArray.slice(); 
			sliceTabName = state.tabName.slice(); 
			sliceTabArray.splice(tabIndex, 1);
			sliceTabName.splice(tabIndex, 1);
			let removeTabId = state.tabsDetails.filter((data)=>{
				return data.tab.id != action.payload
			});
			return {
				...state,
				tabsDetails: removeTabId, 
				currentActiveKey: sliceTabArray[0], 
				currentActiveTabData: Tabs.getCurrentActiveTabData(removeTabId, sliceTabArray[0]),
				tabArray: sliceTabArray,
				tabName: sliceTabName,
				saved: false
			}
		case ADD_NEW_TAB:
			sliceTabArray = state.tabArray.slice();
			sliceTabName = state.tabName.slice();
			sliceTabArray.push(state.tabArray[state.tabArray.length - 1] + 1);
			sliceTabName.push('Untitled');
			return {
				...state, 
				tabArray: sliceTabArray, 
				tabName: sliceTabName, 
				currentActiveKey: sliceTabArray.length - 1, 
				currentActiveTabData: [{
					tab: {"id": sliceTabArray.length - 1, "name": 'Untitiled'},
					data: []
				}],
				tabsDetails: [...state.tabsDetails, {
					tab: {"id": sliceTabArray.length - 1, "name": 'Untitiled'},
					data: []
				}],
				saved: false
			}
		case SAVE_ALL_TABS:
			return {
				...state, saved: true
			}
		case UPDATE_TABS_ON_DROP:
			let newTabArrayOrder = Tabs.arrayMove(state.tabArray, action.payload.dragId, action.payload.dropId);
			let newTabNameOrder = Tabs.arrayMove(state.tabName, action.payload.dragId, action.payload.dropId);
			return {
				...state, tabName: newTabNameOrder, tabArray: newTabArrayOrder, saved: false
			}
		case UPDATE_CHARTS_ON_DROP:
			let newArrOrder = Tabs.arrayMove(state.currentActiveTabData[0].data, action.payload.dragId, action.payload.dropId);
			let newTabOrder = null
			return {
				...state, 
				tabsDetails: 
				[
				...state.tabsDetails.map((data) => {
					if(data.tab.id === action.payload.tabId){
						newTabOrder = {
							"tab": data.tab, "data": newArrOrder
						}
						return newTabOrder
					} else {
						return data
					}
				})
				],
				currentActiveTabData: [newTabOrder],
				saved: false
				
			}
			
		default:
			return state
	}
}

