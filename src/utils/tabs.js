import Data from '../../data/report-config';
import axios from 'axios';

export const defaultData = Data.tabs

export function fetchTabs(){
	const url = '/report/get-tabs';
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return req;
}

export function initTabs(tabs){
	let name = [], id = [];
	tabs.forEach((data) => {
		name.push(data.tab.name);
		id.push(data.tab.id);
	});
	return {
		tabsDetails: tabs,
		currentActiveTabData: getCurrentActiveTabData(tabs, tabs[0].tab.id),
		tabArray: id,
		tabName: name,
		saved: true,
		currentActiveKey: id[0]
	}
}

export function getCurrentActiveTabData(tabs, id){
	let currentActiveTabData = tabs.filter((name) => {
		return name.tab.id == id;
	});
	
	return currentActiveTabData;
}

export function move(arr, oldIndex, newIndex) {
	if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}

export function addObservable(tabsDetails, tabData){
	let newTabData = null;
	let newTabsDetails = null;
	let index = tabsDetails.findIndex((data)=>{
		return(data.tab.id === tabData.id)
	});
	
	if(index != -1){
		newTabsDetails = tabsDetails.map((data)=>{
			if(data.tab.id === tabData.id){
				newTabData = {
					"tab": data.tab, "data" : [...data.data, tabData.newData]
				}
				return newTabData;
			} else {
				return data
			}
		});
	} else {
		newTabData = {"tab": {"id": tabData.id, "name": tabData.name}, "data": [tabData.newData]};
		newTabDetails = [...tabsDetails, newTabData];
	}
	return {
		tabsDetails: newTabsDetails,
		currentActiveTabData: [newTabData]
	}
}

export function removeObservable(tabsDetails, newData){
	let newTabsDetails = tabsDetails.map((data)=>{
			return data.tab.id === newData.id 
			? {
				"tab": data.tab, 
				"data" : [...data.data.slice(0, newData.index), ...data.data.slice(newData.index + 1)]
			} 
			: data
		});
	return {
		tabsDetails: newTabsDetails
	}
}

export function remove(state, id){
	let tabIndex = state.tabArray.findIndex((tabId)=>{ return tabId == id});
	let sliceTabArray = state.tabArray.slice(); 
	let sliceTabName = state.tabName.slice(); 
	sliceTabArray.splice(tabIndex, 1);
	sliceTabName.splice(tabIndex, 1);
	let removeTabId = state.tabsDetails.filter((data)=>{
		return data.tab.id != id
	});
	return {
		currentActiveKey: sliceTabArray[0],
		tabsDetails: removeTabId,
		currentActiveTabData: getCurrentActiveTabData(removeTabId, sliceTabArray[0]),
		tabName: sliceTabName,
		tabArray: sliceTabArray,
		saved: false
	}
}

export function add(state){
	let sliceTabArray = state.tabArray.slice();
	let sliceTabName = state.tabName.slice();
	sliceTabArray.push(state.tabArray[state.tabArray.length - 1] + 1);
	sliceTabName.push('Untitled');
	return {
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
}

export function saveAll(tabs){
	let url = `/report/save-tab-data`;
	let stringifyTabs = JSON.stringify(tabs);
	const data = new FormData();
	data.append('tabs', stringifyTabs);
	let req = axios.post(url, data);
	return req;
}

export function changeTabName(tabsDetails, tabs, newData){
	let sliceTabs = tabs.slice();
	sliceTabs[newData.id] = newData.name;
	let newTabsDetails = tabsDetails.map((data)=>{
		if(data.tab.id === newData.id){
			return {
				"tab": {"id": data.tab.id, "name": newData.name}, "data" : data.data
			}
		} else {
			return data
		}
	});
	return {
		tabName: sliceTabs,
		tabsDetails: newTabsDetails
	}
}

export function updateChartPosition(tabsData, params){
	let newTabData = null;
	const newChartPosition = tabsData.map((data) => {
		if(data.tab.id === params.id){
			newTabData = {
				"tab": data.tab, "data": data.data.map((data, index) => {
					return {...data , "position": params.layout[index]}
				})
			}
			return newTabData;
		} else {
			return data
		}
	});
	return {
		tabsDetails: newChartPosition,
		currentActiveTabData: [newTabData]
	}
}