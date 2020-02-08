import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the SetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setpassword',
  templateUrl: 'setpassword.html',
})
export class SetpasswordPage {

  setpasswordForm: FormGroup;
  setpasswordData = { 'oldpass': '', 'newpass':'', 'cnfnewpass':'' };
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  UserData;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get("user_data").then((userval) => {
      //console.log('User details is', userval);
      this.UserData = userval;
      console.log(this.UserData);
    });
    console.log(this.UserData.email);
  }

  ngOnInit() {
    //let userotp = this.UserData['user_data'].id;
    this.setpasswordForm = new FormGroup({
      //email: new FormControl('', [Validators.required, Validators.pattern(userotp)])
    });
  }

}
