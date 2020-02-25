import { Component } from '@angular/core';
import { IonicPage, NavController, Nav, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverComponent } from '../../components/popover/popover';
import { Http, Headers, Response } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HomePage } from '../../pages/home/home';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})
export class RegisterPage {

	public hidecontinue = true;
	public hideregister = false;
	public hideotp = false;
	signupform: FormGroup;
	//userData = { "name": "", "email": "", "country": "", "dob": "", "password": "","cnfpassword":"" };
	userData = { "name": "", "email": "", "otp": "" };
	public userDetails: string = "userdetails";
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public http: Http, private toastCtrl: ToastController, public storage: Storage, public nav: Nav, public loadingCtrl: LoadingController) {
	}

	ngOnInit() {
		let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.signupform = new FormGroup({
			name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
			email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
			otp: new FormControl('', [Validators.required, Validators.minLength(6)])
			// country: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(20)]),
			// dob: new FormControl('', [Validators.required]),
			//password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
			//cnfpassword: new FormControl('', [Validators.required]),
		});
	}

	// Signup 
	sentotp() {
		console.log('sentotp');
		var data = this.signupform.value;
		//console.log(data);
		var regdata = {
			"email": data.email,
		};
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();
		//let _url: string = "http://orga-nice-app.com/api/v1/user/register";
		let _url: string = "http://orga-nice-app.com/api/v1/user/regotp";
		this.http.post(_url, regdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let result = JSON.parse(data["_body"]);
					//console.log(result);


					loading.dismiss();
					loading.onDidDismiss(() => {
						let toast = this.toastCtrl.create({
							message: result,
							duration: 1000,
							position: 'top',
							cssClass: "customtoast",
						});

						toast.onDidDismiss(() => {
							console.log('Dismissed toast');
							if (result == "Otp successfully sent.") {
								console.log(result);
								//this.signupform.reset();
								//this.nav.popToRoot();
								this.hideregister = true;
								this.hideotp = true;
								this.hidecontinue = false;
							}

						});

						toast.present();
					});
				});
		// set the user details to localstorage
		//this.storage.set(this.userDetails, regdata);
		// get the value from localstorage
		// Or to get a key/value pair
		/* this.storage.get(this.userDetails).then((val) => {
		  console.log('User details is', val);
		}); */
	}

	signup() {

		if (this.signupform.valid) {
			var data = this.signupform.value;
			//console.log(data);
			var regdata = {
				"name": data.name,
				"email": data.email,
				"otp": data.otp
			};
			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});

			loading.present();
			//let _url: string = "http://orga-nice-app.com/api/v1/user/register";
			let _url: string = "http://orga-nice-app.com/api/v1/user/regotpverify";
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
								console.log('Dismissed toast');
								if (result.message == "Registerd successfully.") {
									console.log(result);
									this.signupform.reset();

									this.storage.ready().then(() => {
										this.storage.set(this.userDetails, result).then(() => {
											this.storage.get('userdetails').then((value) => {
												//this.nav.popToRoot();
												//this.navCtrl.setRoot(HomePage);
												this.navCtrl.setRoot(ProfilePage);


											});

										});
									});




								}
							});

							toast.present();
						});
					});
			// set the user details to localstorage
			this.storage.set(this.userDetails, regdata);
			// get the value from localstorage
			// Or to get a key/value pair
			this.storage.get(this.userDetails).then((val) => {
				console.log('User details is', val);
			});
		}
	}
	/* signupold() {
		 
	  if (this.signupform.valid) {
		var data = this.signupform.value;
		//console.log(data);
		var regdata = {
		  "name": data.name,
		  "email": data.email,
		  "country": data.country,
		  "dob": data.dob,
		  "password": data.password
		};
		let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			  });
  
			  loading.present(); 
		//let _url: string = "http://orga-nice-app.com/api/v1/user/register";
		let _url: string = "http://orga-nice-app.com/api/v1/user/reg";
		this.http.post(_url, regdata, { headers: this.headers })
		  .subscribe(
			(data) => {
			  let result = JSON.parse(data["_body"]);
			  //console.log(result);
  
			 
			  loading.dismiss();
			  loading.onDidDismiss(() => {
				let toast = this.toastCtrl.create({
				  message: result,
				  duration: 1000,
				  position: 'top',
				  cssClass: "customtoast",
				});
  
				toast.onDidDismiss(() => {
				  console.log('Dismissed toast');
				  if (result == "Registerd successfully."){
					console.log(result);
					this.signupform.reset();
					this.nav.popToRoot();
				    
				  }
				});
  
				toast.present();
			  });
			});
		// set the user details to localstorage
		this.storage.set(this.userDetails, regdata);
		// get the value from localstorage
		// Or to get a key/value pair
		this.storage.get(this.userDetails).then((val) => {
		  console.log('User details is', val);
		});
	  }
	}
   */

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}

	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}

}
