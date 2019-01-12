import {FETCH_CHART_DATA} from '../actions/index';

export default function (state = null, action){
	switch(action.type){
		case FETCH_CHART_DATA:
			return action.payload.data;
	}
}