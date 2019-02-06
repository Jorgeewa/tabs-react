import axios from 'axios';
import * as Tabs from '../utils/tabs';

export const INIT = 'INIT';
export const ADD_OBSERVABLE = 'ADD_OBSERVABLE';
export const REMOVE_OBSERVABLE = 'REMOVE_OBSERVABLE';
export const SET_TABS = 'SET_TABS';
export const SET_CHART_DATA = 'FETCH_CHART_DATA';
export const CHART_LOADED = 'CHART_LOADED';
export const SET_FORM_PARAMS = 'SET_FORM_PARAMS';
export const INIT_TAB_DETAILS = 'EXTRACT_TAB_DETAILS';
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const HIDE_TAB = 'HIDE_TAB';
export const ADD_NEW_TAB = 'ADD_NEW_TAB';
export const SAVE_ALL_TABS_CLICKED = 'SAVE_ALL_TABS_CLICKED';
export const SAVE_ALL_TABS_FAILURE = 'SAVE_ALL_TABS_FAILURE';
export const SAVE_ALL_TABS_SUCCESS = 'SAVE_ALL_TABS_SUCCESS';
export const UPDATE_TABS_ON_DROP = 'UPDATE_TABS_ON_DROP';
export const EXTRACT_CHART_DETAILS = 'EXTRACT_CHART_DETAILS';
export const SET_NEW_CHART_DETAIL = 'SET_NEW_CHART_DETAIL';
export const UPDATE_CHARTS_ON_DROP = 'UPDATE_CHARTS_ON_DROP';
export const TAB_CONTENT_LOADED = 'TAB_CONTENT_LOADED';
export const UPDATE_TAB_NAME = 'UPDATE_TAB_NAME';
export const UPDATE_CHART_POSITION = 'UPDATE_CHART_POSITION';


export function init(){
	return {
		type: INIT
	}
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

export function setTabs(res){
	let tabs = (res && res.data && res.data.tabs) ? JSON.parse(res.data.tabs) : Tabs.defaultData;
	return {
		type: SET_TABS,
		tabs: tabs
	}
}

export function chartLoaded(data){
	return {
		type: CHART_LOADED,
		data: {
			data: data,
			meta: {
				chartId: `${data.roundId}_${data.observableName}`
			}
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

export function saveAllClicked(tabs){
	return {
		type: SAVE_ALL_TABS_CLICKED,
		tabs: tabs
	}
	
}

export function saveAllTabsSuccess(){
	return {
		type: SAVE_ALL_TABS_SUCCESS
	}
}

export function saveAllTabsFailure(){
	return {
		type: SAVE_ALL_TABS_FAILURE
	}
}
export function setFormParams(res){
	return {
		type: SET_FORM_PARAMS,
		data: res.data
	}
}

export function tabContentLoaded(){
	return {
		type: TAB_CONTENT_LOADED
	}
}

export function updateTabsOnDrop(params){
	return {
		type: UPDATE_TABS_ON_DROP,
		payload: params
	}
}

export const setChartData = (actionData) => (res) => {
	return {
		type: SET_CHART_DATA,
		data: res,
		meta: {
			chartId: `${actionData.data.roundId}_${actionData.data.observableName}`
		}
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

export function updateTabName(params){
	return {
		type: UPDATE_TAB_NAME,
		payload: params
	}
}

export function chartResized(layout, id){
	return {
		type: UPDATE_CHART_POSITION,
		payload: {
			layout: layout,
			id: id
		}
	}
}