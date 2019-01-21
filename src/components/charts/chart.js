import React from 'react';
import Plot from 'react-plotly.js';
import {heatmaps, graphs } from '../../utils/plotly/chart-plot';

const GRAPHS = 'Graphs';
const HEATMAPS = 'Heat maps';


export default (props) => {
    let params = props.typeOfChart == GRAPHS ? 
        graphs(props.data.x, props.data.y, props.width, props.observableId) : 
        heatmaps(props.data, props.observableId);
    return(
        <Plot
            data={params.data}
            layout={ params.layout }
        />
    );
}