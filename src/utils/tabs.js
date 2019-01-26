import Data from '../../data/report-config';
import axios from 'axios';

export const defaultData = Data.tabs

export function fetchTabs(){
	const url = '/report/get-tabs';
	const req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return req;
}

export function initTabs(tabs){
	let name = [], id = [];
	tabs.forEach((data) => {
		name.push(data.tab.name);
		id.push(data.tab.id);
	});
	return {
		tabsDetails: tabs,
		currentActiveTabData: getCurrentActiveTabData(tabs, tabs[0].tab.id),
		tabArray: id,
		tabName: name,
		saved: true,
		currentActiveKey: id[0]
	}
}

export function getCurrentActiveTabData(tabs, id){
	let currentActiveTabData = tabs.filter((name) => {
		return name.tab.id == id;
	});
	
	return currentActiveTabData;
}

export function arrayMove(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};