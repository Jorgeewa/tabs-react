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

export function reorder(state, dragParams){
	
	const currentActiveTabData = state.currentActiveTabData[0].data;
	const dragW = currentActiveTabData[dragParams.dragId].position.w > 1;
	const dragH = currentActiveTabData[dragParams.dragId].position.h > 1;
	const dropW = currentActiveTabData[dragParams.dropId].position.w > 1;
	const dropH = currentActiveTabData[dragParams.dropId].position.h > 1;
	
	if(dragW || dragH || dropW || dropH){
		return state;
	}
	
	let newArrOrder = move(currentActiveTabData, dragParams.dragId, dragParams.dropId);
	let newTabOrder = null;
	let tabsDetails = [
				...state.tabsDetails.map((data) => {
					if(data.tab.id === dragParams.tabId){
						newTabOrder = {
							"tab": data.tab, "data": newArrOrder
						}
						return newTabOrder
					} else {
						return data
					}
				})
				];
	return {
		tabsDetails: tabsDetails,
		currentActiveTabData: [newTabOrder],
		saved: false
	}
}