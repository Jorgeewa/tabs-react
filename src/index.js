import React from 'react';
import ReactDOM from 'react-dom';
import Report from './components/report';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReduxPromise from 'redux-promise';
import { install } from 'redux-loop';
import Data from '../data/report-config';

const enhancer = compose(
	applyMiddleware(ReduxPromise),
	install()
);
const initializeState = {
	tabsData: {
		tabsDetails: [],
		tabArray: [],
		tabName: [],
		position: [],
		currentActiveKey: 0,
		saved: false,
		currentActiveTabData: [
			{
				tab: {
					id: null,
					name: null,
					position: {
							"i": null,
							"x": null, 
							"y": null, 
							"w" : null, 
							"h": null, 
							"maxH": null, 
							"maxW": null, 
							"minH": null, 
							"minW": null, 
							"isDraggable": true, 
							"isResizable": false	
					}
				},
				data: [
					{
						observableId: null,
						observableName: null,
						position: {
								"x": null, 
								"y": null, 
								"w" : null, 
								"h": null, 
								"maxH": null, 
								"maxW": null, 
								"minH": null, 
								"minW": null, 
								"isDraggable": true, 
								"isResizable": true		
						},
						typeOfChart: null,
						roundId: null
					}
				]

			}
		]
	},
 	form: null,
	formParams: {
		 rounds: [],
		 observables: [],
		 chartTypes: []
	},
	chartData: {
		
	}
}
const store = createStore(reducers, initializeState, enhancer);
		
ReactDOM.render(
	<Provider store={store}>
	    <BrowserRouter>
	      <Switch>
			  <Route path="/report" component={Report}/>
		  </Switch>
	    </BrowserRouter>
	</Provider>
  , document.querySelector('.test-report'));
