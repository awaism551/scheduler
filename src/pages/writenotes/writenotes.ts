import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Nav, ToastController, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { QuicknotesPage } from '../quicknotes/quicknotes';

/**
 * Generated class for the WritenotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-writenotes',
	templateUrl: 'writenotes.html',
})
export class WritenotesPage {
	noteForm: FormGroup;
	noteData = { "notes": "" };
	public UserDetails = Array();
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private storage: Storage, public http: Http, private nav: Nav, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {
	}

	ngOnInit() {
		this.noteForm = new FormGroup({
			notes: new FormControl('', [Validators.required]),
		});
	}

	ionViewDidLoad() {
		this.storage.get("userdetails").then((userval) => {
			//console.log('User details is', userval);
			this.UserDetails = userval;
			console.log(this.UserDetails['userdetails'].id);
		});
		console.log('ionViewDidLoad WritenotesPage');
	}

	/* add notes */
	add_notes() {
		if (this.noteForm.valid) {
			let data = this.noteForm.value;
			let notedata = {
				'user_id': this.UserDetails['userdetails'].id,
				'note': data.notes
			};
			console.log(notedata);
			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});

			loading.present();
			let _url: string = "http://orga-nice-app.com/api/v1/user/stickynotes";
			this.http.post(_url, notedata, { headers: this.headers })
				.subscribe(
					(data) => {
						let result = JSON.parse(data["_body"]);
						//console.log(result);
						if (result.status == "failed") {

							loading.dismiss();
							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 1000,
								position: 'top',
								cssClass: "customtoast",
							});
							toast.onDidDismiss(() => {
								console.log('Dismissed toast');
							});
							toast.present();
						} else {
							loading.dismiss();
							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 1000,
								position: 'top',
								cssClass: "customtoast",
							});

							toast.onDidDismiss(() => {
								console.log('Log in toast');
								//console.log(result);
								this.noteForm.reset();
								//this.nav.popToRoot();
								//this.navCtrl.remove(1, 1);
								//this.navCtrl.push(QuicknotesPage);
								//window.location.reload();

								this.nav.push(QuicknotesPage).then(() => {
									//const index = this.nav.getActive().index;
									//this.nav.remove(0, index);
									const startIndex = this.navCtrl.getActive().index - 1;
									this.navCtrl.remove(startIndex, 1);

									const startIndex2 = this.navCtrl.getActive().index - 2;
									this.navCtrl.remove(startIndex2, 1);
								});
							});
							toast.present();
						}
					});

		}
	}
	/* end of add notes */
	goquicknotes() {
		this.navCtrl.push(QuicknotesPage)
	}

	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}
}
