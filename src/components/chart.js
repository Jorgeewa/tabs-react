import React from 'react';
import Plot from 'react-plotly.js';

class Chart extends React.Component {
	
	
	getParams = (x, y, observableId) => {
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
			width: this.props.width - 20,
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
  render() {
	  
	  let params = this.getParams(this.props.x, this.props.y, this.props.observableId);
	  //this.props.spinnerOff();
    return (
      <Plot
        data={params.data}
        layout={ params.layout }
      />
    );
  }
}

export default Chart;