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
		currentActiveKey: 0,
		saved: false,
		currentActiveTabData: [
			{
				tab: {
					id: null,
					name: null,
				},
				data: [
					{
						observableId: null,
						observableName: null,
						position: null,
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
