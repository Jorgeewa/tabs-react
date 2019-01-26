import {SET_FORM_PARAMS, TAB_CONTENT_LOADED, setFormParams} from '../actions/index';
import { loop, Cmd } from 'redux-loop';
import * as Modal from '../utils/modal';

export default function (state = initialState, action){
	switch(action.type){
		case TAB_CONTENT_LOADED:
			return loop (
				{...state},
				Cmd.run(Modal.fetchFormParams, {
					successActionCreator: setFormParams
				})
			);
			
		case SET_FORM_PARAMS:
			return action.formData
		default: 
			return state
	}
}