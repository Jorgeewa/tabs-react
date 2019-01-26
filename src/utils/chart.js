import axios from 'axios';
const OBSERVABLE_CODE = {
							'Graphs': 'past_graphs', 
							'Heat maps': 'past_heat_maps',
							'Scatter plots': 'past_scatter_plots'
						}

export function fetchData(data){
	//use destructuring here
	let roundId = data.data.roundId;
	let observableName = data.data.observableName;
	let observableCode = OBSERVABLE_CODE[data.data.typeOfChart];
	const url = `/report/get-chart-data?roundId=${roundId}&observableName=${observableName}&observableCode=${observableCode}`;
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return req;
}

export function extractChartDetails(tabsData){
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

export function parseData(data, type){
	if(type == 'Graphs'){
		return {
			x: JSON.parse(data.measurement.split("\n")[0]),
			y: JSON.parse(data.measurement.split("\n")[1])
		}
	} else {
		return JSON.parse((data.measurement))
	}
}