import axios from 'axios';

export function fetchFormParams(){
	let url = `/report/get-report-form-params`;
	let req = axios.get(url,{ headers: { 'content-type': 'application/x-www-form-urlencoded' }});
	return req;
}