import Data from '../../data/report-config';
import {ADD_OBSERVABLE} from '../actions/index';
import {REMOVE_OBSERVABLE} from '../actions/index';
import {FETCH_CUSTOM_TABS} from '../actions/index';


export default function(state = Data.tabs, action){
	switch(action.type){
		case ADD_OBSERVABLE:
			let index = state.findIndex((data)=>{
				return(data.tab.id === action.payload.id)
			});
			
			if(index != -1){
				return[
					...state.map((data)=>{
						return data.tab.id === action.payload.id ? 
							{
							"tab": data.tab, "data" : [...data.data, action.payload.newData]
						} : 
						data
					})
					
				];
			} else {
				return [...state, {"tab": {"id": action.payload.id, "name": action.payload.name}, "data": [action.payload.newData]}]
			}
		case REMOVE_OBSERVABLE:
			return [
					...state.map((data)=>{
						return data.tab.id === action.payload.id ? {"tab": data.tab, "data" : [...data.data.slice(0, action.payload.index), ...data.data.slice(action.payload.index+1)]} : data
					})
			];
			
		case FETCH_CUSTOM_TABS:
			if(action.payload.data.tabs){
				return action.payload.data.tabs;
			}
			
		default:
			return state
	}
}