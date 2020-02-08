import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';

/**
 * Generated class for the RateusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-rateus',
  templateUrl: 'rateus.html',
})
export class RateusPage {
  public anArray: any = [];
  data: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RateusPage');
  }

  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

  //dynamic input field
  goTo() {
    console.log('this.anArray', this.anArray);
    this.data = true;
  }
  Add() {
    this.anArray.push({ 'value': '' });
  }
}
