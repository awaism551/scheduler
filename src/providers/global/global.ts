import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {

	// public url = "http://orga-nice-app.com/";
	public url = "http://orga-nice-app.com/";
	constructor(public http: HttpClient) {
		console.log('Hello GlobalProvider Provider');
	}

}
