import axios from 'axios';

export const ADD_OBSERVABLE = 'ADD_OBSERVABLE';
export const REMOVE_OBSERVABLE = 'REMOVE_OBSERVABLE';
export const FETCH_CUSTOM_TABS = 'FETCH_CUSTOM_TABS';
export const FETCH_CHART_DATA = 'FETCH_CHART_DATA';
export const FETCH_FORM_PARAMS = 'FETCH_FORM_PARAMS';
export const INIT_TAB_DETAILS = 'EXTRACT_TAB_DETAILS';
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const HIDE_TAB = 'HIDE_TAB';
export const ADD_NEW_TAB = 'ADD_NEW_TAB';
export const SAVE_ALL_TABS = 'SAVE_ALL_TABS';
export const UPDATE_TABS_ON_DROP = 'UPDATE_TABS_ON_DROP';
export const EXTRACT_CHART_DETAILS = 'EXTRACT_CHART_DETAILS';
export const SET_NEW_CHART_DETAIL = 'SET_NEW_CHART_DETAIL';
export const UPDATE_CHARTS_ON_DROP = 'UPDATE_CHARTS_ON_DROP';

const OBSERVABLE_CODE = {
							'Graphs': 'past_graphs', 
							'Heat maps': 'past_heat_maps',
							'Scatter plots': 'past_scatter_plots'
						}

export function addObservable(data){
	return {
		type: ADD_OBSERVABLE,
		payload: data
	}
}

export function removeObservable(data){
	return {
		type: REMOVE_OBSERVABLE,
		payload: data
	}
}

export function getTabs(){
	const url = '/report/get-tabs';
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return {
		type: FETCH_CUSTOM_TABS,
		payload: req
	}
}

export function fetchChartData(data){
	let roundId = data.roundId;
	let observableName = data.observableName;
	let observableCode = OBSERVABLE_CODE[data.typeOfChart];
	const url = `/report/get-chart-data?roundId=${roundId}&observableName=${observableName}&observableCode=${observableCode}`;
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return {
		type: FETCH_CHART_DATA,
		payload: req,
		meta: {
			chartId: `${data.roundId}_${data.observableName}`
		}
	}
}

export function setActiveTab(data){
	return {
		type: SET_ACTIVE_TAB,
		payload: data
	}
}

export function hideTab(key){
	return {
		type: HIDE_TAB,
		payload: key
	}
}

export function addNewTab(){
	return {
		type: ADD_NEW_TAB
	}
}

export function saveAllTabs(tabs){
	let url = `/report/save-tab-data`;
	let stringifyTabs = JSON.stringify(tabs);
	const data = new FormData();
	data.append('tabs', stringifyTabs);
	let request = axios.post(url, data);
	return {
		type: SAVE_ALL_TABS,
		payload: request
	}
	
}

export function fetchFormParams(){
	let url = `/report/get-report-form-params`;
	let request = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return {
		type: FETCH_FORM_PARAMS,
		payload: request
	}
}

export function updateTabsOnDrop(params){
	return {
		type: UPDATE_TABS_ON_DROP,
		payload: params
	}
}

export function extractChartDetails(data){
	return {
		type: EXTRACT_CHART_DETAILS,
		payload: data
	}
}

export function setNewChartDetail(params){
	return {
		type: SET_NEW_CHART_DETAIL,
		payload: params
	}
}

export function updateChartsOnDrop(params){
	return {
		type: UPDATE_CHARTS_ON_DROP,
		payload: params
	}
}