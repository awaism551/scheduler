import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController ,LoadingController} from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';

/**
 * Generated class for the PrivacypoliciesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-privacypolicies',
  templateUrl: 'privacypolicies.html',
})
export class PrivacypoliciesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacypoliciesPage2');
  }

  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
}
