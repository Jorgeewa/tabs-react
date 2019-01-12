import axios from 'axios';

export const ADD_OBSERVABLE = 'ADD_OBSERVABLE';
export const REMOVE_OBSERVABLE = 'REMOVE_OBSERVABLE';
export const FETCH_CUSTOM_TABS = 'FETCH_CUSTOM_TABS';
export const FETCH_CHART_DATA = 'FETCH_CHART_DATA';

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
	const url = 'http://localhost:8181/report/get-tabs';
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return {
		type: FETCH_CUSTOM_TABS,
		payload: req
	}
}

export function fetchChartData(data){
	roundId = data.roundId;
	observableName = data.observableName;
	observableCode = data.observableCode;
	const url = `http://localhost:8181/report/get-chart-data?roundId=${roundId}&observableName=${observableName}&observableCode=${observableCode}`;
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return {
		type: FETCH_CHART_DATA,
		payload: req
	}
}