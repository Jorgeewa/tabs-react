export function heatmaps(heatMapPastData, observableId){
	const OBSERVABLE_UNITS = {
		'tempabc': '°c',
		'humabcd': '%',
		'asabcde': 'm/s',
		'co2abcd': 'ppm',
		'digindx': '%',
		'lghtint': 'lux'
	};
	let data = [
		  {
			//z: heatMapPastData[Object.keys(heatMapPastData)[Object.keys(heatMapPastData).length - 1]],
			z: heatMapPastData[Object.keys(heatMapPastData)[0]],
			type: 'heatmap',
			zsmooth: 'best',
			connectgaps: true,
			colorscale: [
			  [0.0, 'rgb(0, 0, 255)'],
				[0.5,'rgb(51, 204, 51)' ], 
				[0.75, 'rgb(255, 255, 102)'],
			  [1.0, 'rgb(255, 51, 0)' ]
			  ],
			colorbar: {
				title: OBSERVABLE_UNITS[observableId] ? OBSERVABLE_UNITS[observableId] : '#',
				titlefont: {
					size: 20
				},
				titleside: 'bottom'
			}
		  }
	];
		let steps = [];
		let frames = [];
	let counter;
	let days = Object.keys(heatMapPastData);
	days.forEach(function(data){
		let newData = {
			label: data,
			method: 'animate',
			args: [[data], {
			mode: 'immediate',
			frame: {redraw: true, duration: 500},
			transition: {duration: 500}
		}]
		};
		let rowFrame = {
			name: data,
			data : [{
				z: heatMapPastData[data],
				type : 'heatmap'
			}]

		}

		steps.push(newData);
		frames.push(rowFrame);
	});
	let layout = {
	  autosize: false,
		width: $(".chart-title").width(),
		height: 500,
	  margin: {
		l: 50,
		r: 50,
		b: 25,
		t: 25,
		pad: 5
	  },
	sliders: [{
	  pad: {t: 30},
	  x: 0.05,
	  len: 0.95,
	  currentvalue: {
		xanchor: 'right',
		prefix: 'Day:',
		font: {
		  color: '#888',
		  size: 20
		}
	  },
	  transition: {duration: 500},
		steps : steps
		}],
		xaxis: {
			title: "Length of the house (m)"
		},
		yaxis: {
			title: "Width of the house (m)"
		},
	};
	
	return {
		data: data,
		layout: layout
	}
}

export function graphs(x, y, width, observableId){
	const observableIdMax = {
			'tempabc' : 40,
			'co2abcd' : 5000,
			'asabcde' : 1,
			'humabcd' : 100
		};
	const OBSERVABLE_UNITS = {
		'tempabc': 'values in °c',
		'humabcd': 'values in %',
		'asabcde': 'values in m/s',
		'co2abcd': 'values in ppm',
		'digindx': 'values in %'
	};
	let data = {
		x: y,
		y: x,
		mode: 'markers',
		type: 'bar',
		orientation: 'v'
	};
	let layout = {
	  xaxis: {
		range: [y[0], y[y.length-1]],
		title : "Time (Hours)",
		rangeslider : {
			visible : true,
			thickness : 0.2,
			borderwidth: 2,
			"bgcolor": "#fafafa",
			"bordercolor": "black",
			range : [y[0], y[y.length-1]]
		},
		showgrid: true,
		showline: true,
		mirror: 'ticks',
		gridcolor: '#bdbdbd',
		gridwidth: 2,
		linecolor: '#636363',
		linewidth: 6
	  },
	  yaxis: {
		range: observableIdMax[observableId] ? [0, observableIdMax[observableId]] : null,
		title: OBSERVABLE_UNITS[observableId] ? OBSERVABLE_UNITS[observableId] : '#',
		showgrid: true,
		showline: true,
		mirror: 'ticks',
		gridcolor: '#bdbdbd',
		gridwidth: 2,
		linecolor: '#636363',
		linewidth: 6
	  },
	  legend: {
		y: -0.105,
		orientation: "h",
		font: {
		  family: 'Arial, sans-serif',
		  size: 10,
		  color: 'grey',
		}
	  },
		autosize: false,
		width: width - 20,
		height: 400,
		  margin: {
			l: 50,
			r: 50,
			b: 40,
			t: 40,
			pad: 5
		  }

	};
	return {
		data: [data],
		layout: layout
	}
}