import {FETCH_CHART_DATA, EXTRACT_CHART_DETAILS, SET_NEW_CHART_DETAIL} from '../actions/index';
import Data from '../../data/report-config';

let initialState = extractChartDetails(Data.tabs);

export default function (state = initialState, action){
	let chartId = null;
	switch(action.type){
		case EXTRACT_CHART_DETAILS:
			return extractChartDetails(action.payload)
		case FETCH_CHART_DATA:
			chartId = action.meta.chartId;
			if(!action.payload.data.error){
				let parsedData = parseData(action.payload.data, state[chartId].type);
				return { ...state, [chartId]: {
												type: state[chartId].type,
												data: parsedData
										}
					}
			} else {
				return state
			}
		case SET_NEW_CHART_DETAIL:
			chartId = `${action.payload.roundId}_${action.payload.observableName}`;
			state[chartId] = {
						type: action.payload.typeOfChart,
						data: {

						}
					}
			return state
		default:
			return state
	}
}

function extractChartDetails(tabsData){
	let chartData = {};
	tabsData.forEach((tab) => {
		tab.data.forEach((data) => {
			chartData[`${data.roundId}_${data.observableName}`] = 
				{
					type: data.typeOfChart,
					data: {

					}
				}
			})
	});
	return chartData;
}

function parseData(data, type){
	if(type == 'Graphs'){
		return {
			x: JSON.parse(data.measurement.split("\n")[0]),
			y: JSON.parse(data.measurement.split("\n")[1])
		}
	} else {
		return JSON.parse((data.measurement))
	}
}