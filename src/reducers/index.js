import { combineReducers } from 'redux-loop';
import { reducer as formReducer } from 'redux-form';
import TabsContent from './reducer_tabs_content';
import ChartData from './reducer_chart_data';
import FormParams from './reducer_form_params';

const rootReducer = combineReducers({
	tabsData: TabsContent,
	formParams: FormParams,
 	form: formReducer,
	chartData: ChartData
});

export default rootReducer;
