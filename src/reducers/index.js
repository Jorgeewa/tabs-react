import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import TabsContent from './reducer_tabs_content';
import ChartData from './reducer_chart_data';

const rootReducer = combineReducers({
	tabs: TabsContent,
 	form: formReducer
});

export default rootReducer;
