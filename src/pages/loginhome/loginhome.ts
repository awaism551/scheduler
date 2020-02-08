import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';

import { RegisterPage } from '../register/register';

import { LoginPage } from '../login/login';

/**
 * Generated class for the LoginhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-loginhome',
  templateUrl: 'loginhome.html',
})
export class LoginhomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginhomePage');
  }

  //popover
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
	 gologin(){
	this.navCtrl.push(LoginPage);
  }

  goRegister(){
    this.navCtrl.push(RegisterPage);
  }
}
