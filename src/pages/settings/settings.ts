import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { ProfilePage } from '../profile/profile';
import { AppsettingsPage } from '../appsettings/appsettings';
import { PrivacypoliciesPage } from '../privacypolicies/privacypolicies';
import { TermandconditionsPage } from '../termandconditions/termandconditions';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  goprofile(){
  this.navCtrl.push(ProfilePage);
  }
  goappsettings(){
  this.navCtrl.push(AppsettingsPage)
  }
  goprivacypolicies(){
    this.navCtrl.push(PrivacypoliciesPage)
  }
  gotermandconditions(){
    this.navCtrl.push(TermandconditionsPage)
	//  window.open('http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/Mobile-App-Terms.pdf', '_system', 'location=yes');
  }
  gorateus()
  {
	  window.open('https://play.google.com/store', '_system', 'location=yes');
  }
  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

}
