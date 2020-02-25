import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverComponent } from '../../components/popover/popover';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})
export class ProfilePage {

	signupformupdate: FormGroup;
	public UserDetails = Array();
	userdetails = Array();
	public userDetails: string = "userdetails";
	userData = { "name": "", "email": "", "country": "", "dob": "" };
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(private toastCtrl: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private storage: Storage, public http: Http, ) {
	}
	ngOnInit() {
		let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.signupformupdate = new FormGroup({
			name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
			email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
			country: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(20)]),
			dob: new FormControl('', [Validators.required]),
			//password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
			//cnfpassword: new FormControl('', [Validators.required]),
		});
	}
	ionViewDidLoad() {
		this.storage.get("userdetails").then((userval) => {
			//console.log('User details is', userval);
			this.UserDetails = userval;
			//console.log(this.UserDetails);
			//console.log(this.UserDetails['userdetails'].id);
		});
		//console.log(this.UserDetails[0]);


		/* this.storage.ready().then(() => {
						  this.storage.get('userdetails').then((value) => {
								 console.log(this.userdetails);
									  
									});
						}); */
	}

	signupupdate() {

		if (this.signupformupdate.valid) {
			var data = this.signupformupdate.value;
			//console.log(data);
			var regdata = {
				"name": data.name,
				"email": data.email,
				"country": data.country,
				"dob": data.dob
			};
			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});

			loading.present();
			//let _url: string = "http://orga-nice-app.com/api/v1/user/register";
			let _url: string = "http://orga-nice-app.com/api/v1/user/profileupdate";
			this.http.post(_url, regdata, { headers: this.headers })
				.subscribe(
					(data) => {
						let result = JSON.parse(data["_body"]);
						//console.log(result); 


						loading.dismiss();
						loading.onDidDismiss(() => {
							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 1000,
								position: 'top',
								cssClass: "customtoast",
							});

							toast.onDidDismiss(() => {
								//console.log('Dismissed toast');
								if (result.message == "Updated successfully.") {
									//console.log(result);
									this.storage.ready().then(() => {
										this.storage.set(this.userDetails, result).then(() => {
											this.storage.get('userdetails').then((value) => {
												this.navCtrl.setRoot(HomePage);


											});

										});
									});

								}
							});

							toast.present();
						});
					});

		}
	}
	ionViewDidEnter() {
		this.user_details();
	}

	user_details() {
		this.userdetails = this.UserDetails['userdetails'];
		console.log(this.userdetails);
	}

	changepassword() {
		this.navCtrl.push(ChangepasswordPage);
	}
	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}
}
