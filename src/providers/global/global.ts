import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  // public url = "http://orga-nice-app.com/";
  public url = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/";
  constructor(public http: HttpClient) {
    console.log('Hello GlobalProvider Provider');
  }

}
