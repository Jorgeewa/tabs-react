import React, { Component } from 'react';
import Tabs from '../containers/tabs';
import TabContent from '../containers/tab-content';

class Report extends Component {
	render(){
		return(
			<div>
				<Tabs/>
				<TabContent/>
			</div>
		);
	}
}

export default Report;