import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Nav, AlertController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { PrivacypoliciesPage } from '../../pages/privacypolicies/privacypolicies';
import { TermandconditionsPage } from '../../pages/termandconditions/termandconditions';
import { RateusPage } from '../../pages/rateus/rateus';
import { LoginhomePage } from '../../pages/loginhome/loginhome';
import { TermPage } from '../../pages/term/term';
/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'popover',
	templateUrl: 'popover.html'
})
export class PopoverComponent {
	@ViewChild(Nav) nav: Nav;
	// text: string;

	menus: Array<{
		title: string,
		component: any,
		icon: string
	}>;
	UserDetails = Array();
	constructor(public app: App, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl: ViewController, private alertCtrl: AlertController) {
		// console.log('Hello PopoverComponent Component');
		// this.text = 'Hello World';

		// used for an example of ngFor and navigation
		this.menus = [
			{ title: 'Privacy Policy', component: PrivacypoliciesPage, icon: 'paper' },
			{ title: 'Terms and Conditions', component: TermandconditionsPage, icon: 'lock' },
			//  { title: 'Term', component: TermPage, icon:'lock' },
			{ title: 'Rate Us', component: RateusPage, icon: 'star-half' },
		];

	}

	ionViewDidLoad() {
		this.storage.get("userdetails").then((val) => {
			//console.log('User details is', val);
			this.UserDetails = val;
		});
	}
	// navigation in popover
	goTopage(menu, title) {
		console.log(title);
		if (title == 'Rate Us') {
			window.open('https://play.google.com/store', '_system', 'location=yes');
		}
		else if (title == 'Terms and Conditions') {
			window.open('http://orga-nice-app.com/Mobile-App-Terms.pdf', '_system', 'location=yes');
		}
		else {
			console.log('Into alert controler');
			this.viewCtrl.dismiss().then(() => {
				this.app.getRootNav().push(menu.component);
			});
			/* this.navCtrl.push(menu.component).then(() => {
			  this.viewCtrl.dismiss();
		  }); */
			//this.navCtrl.push(menu.component);
			// this.viewCtrl.dismiss();


			//console.log(this.UserDetails[0]);
			//console.log(this.UserDetails);
			/* if (this.UserDetails == null) {
			  let alert = this.alertCtrl.create({
				title: 'Please Login!',
				subTitle: 'You need to login to your account to view your To-Dos.',
				buttons: [
				  {
					text: 'OK',
					handler: () => {
					  this.navCtrl.push(LoginhomePage);
					  this.viewCtrl.dismiss();
					}
				  }
				]
			  });
			  alert.present();
			}else{
			  this.navCtrl.push(menu.component);
			  this.viewCtrl.dismiss();
			} */
			//this.navCtrl.push(menu.component);
			//this.viewCtrl.dismiss();
		}
	}

}
