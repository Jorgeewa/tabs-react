import Data from '../../data/report-config';
import {ADD_OBSERVABLE, REMOVE_OBSERVABLE, FETCH_CUSTOM_TABS, INIT_TAB_DETAILS, SET_ACTIVE_TAB, HIDE_TAB, ADD_NEW_TAB, SAVE_ALL_TABS, EXTRACT_CHART_DETAILS, UPDATE_TABS_ON_DROP, UPDATE_CHARTS_ON_DROP} from '../actions/index';
import { loop, Cmd } from 'redux-loop';

const defaultTabState = {
	tabsDetails: Data.tabs,
	tabArray: [0, 1],
	tabName: ['default-1', 'default-2'],
	currentActiveKey: 0,
	saved: false,
	currentActiveTabData: getCurrentActiveTabData(Data.tabs, 0)
}

export default function(state, action){
	let sliceTabArray, sliceTabName = null;
	switch(action.type){
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
				...state, tabsDetails: tabsDetails, saved: false, currentActiveTabData : getCurrentActiveTabData(tabsDetails, action.payload.id)
			};
			
		case FETCH_CUSTOM_TABS:
			if(action.payload.data && action.payload.data.tabs){
				let fetchedData = JSON.parse(action.payload.data.tabs);
				return loop (
					{...state, tabsDetails: fetchedData, currentActiveTabData: getCurrentActiveTabData(fetchedData, fetchedData[0].tab.id)},
					Cmd.action({type: INIT_TAB_DETAILS})
				);
			} else {
				return loop (
					{...state, 
					 tabsDetails: Data.tabs, 
					 currentActiveTabData: getCurrentActiveTabData(Data.tabs, 0)},
					Cmd.action({type: INIT_TAB_DETAILS})
				);
			}
		case INIT_TAB_DETAILS:
			let name = [], id = [];
			state.tabsDetails.forEach((data) => {
				name.push(data.tab.name);
				id.push(data.tab.id);
			});

				return loop( {
					...state, 
					tabArray: id, 
					tabName: name, 
					saved: true, 
					currentActiveKey: id[0]
				},
				Cmd.action({type: EXTRACT_CHART_DETAILS, payload: state.tabsDetails})
			)
		case SET_ACTIVE_TAB:
			if(!state.tabArray.some( tabId => tabId == action.payload)){
				return state;
			}
			if(state.currentActiveKey != action.payload){
				let currentActiveTabData = getCurrentActiveTabData(state.tabsDetails, action.payload);
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
				currentActiveTabData: getCurrentActiveTabData(removeTabId, sliceTabArray[0]),
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
			let newTabArrayOrder = array_move(state.tabArray, action.payload.dragId, action.payload.dropId);
			let newTabNameOrder = array_move(state.tabName, action.payload.dragId, action.payload.dropId);
			return {
				...state, tabName: newTabNameOrder, tabArray: newTabArrayOrder, saved: false
			}
		case UPDATE_CHARTS_ON_DROP:
			let newArrOrder = array_move(state.currentActiveTabData[0].data, action.payload.dragId, action.payload.dropId);
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

function getCurrentActiveTabData(tabs, id){
	let currentActiveTabData = tabs.filter((name) => {
		return name.tab.id == id;
	});
	
	return currentActiveTabData;
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};