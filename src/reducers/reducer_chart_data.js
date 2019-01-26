import {SET_CHART_DATA, EXTRACT_CHART_DETAILS, SET_NEW_CHART_DETAIL, SET_TABS, CHART_LOADED, setChartData} from '../actions/index';
import * as Chart from '../utils/chart';
import { loop, Cmd } from 'redux-loop';

export default function (state = initialState, action){
	let chartId = null;
	switch(action.type){
		case SET_TABS:
			return Chart.extractChartDetails(action.tabs);
		case EXTRACT_CHART_DETAILS:
			return Chart.extractChartDetails(action.payload)
		case CHART_LOADED:
			return loop(
				{...state},
				Cmd.run(Chart.fetchData, {
					successActionCreator: setChartData(action.data),
					args: [action.data]
				})
			);		
		case SET_CHART_DATA:
			chartId = action.meta.chartId;
			if(!action.data.data.error){
				let parsedData = Chart.parseData(action.data.data, state[chartId].type);
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

