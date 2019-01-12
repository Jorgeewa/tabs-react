import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from './containers/tabs';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReduxPromise from 'redux-promise';


const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

class Hello extends React.Component {
	render() {return <div>Hello!</div>}
}

class Andrew extends React.Component {
	render() {return <div>Hello World!</div>}
}
	
ReactDOM.render(
	<Provider store={createStoreWithMiddleware(reducers)}>
	    <BrowserRouter>
	      <Switch>
			  <Route path="/report/stupid" component={Hello}/>
			  <Route path="/report" component={Tabs}/>
			  <Route path="/andrew" component={Andrew}/>
		  </Switch>
	    </BrowserRouter>
	</Provider>
  , document.querySelector('.test-report'));
