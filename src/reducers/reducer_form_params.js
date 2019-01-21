import {FETCH_FORM_PARAMS} from '../actions/index';

let initialState = {
	 rounds: null,
	 observables: null,
	 chartTypes: null
}

export default function (state = initialState, action){
	switch(action.type){
		case FETCH_FORM_PARAMS:
			return action.payload.data
		default: 
			return state
	}
}