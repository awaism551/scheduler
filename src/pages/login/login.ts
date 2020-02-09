import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Nav, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { RegisterPage } from '../register/register';
import { ProfilePage } from '../profile/profile';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { HomePage } from '../home/home';
//import { ProfilePage } from '../pages/profile/profile';
import { FCM } from '@ionic-native/fcm';
//import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	public hidecontinue = true;
	public hideregister = false;
	public hideotplogin = false;


	loginform: FormGroup;
	//loginData = { "email": "", "password": "","devicetoken":""};
	loginData = { "email": "", "devicetoken": "", "otp": "" };
	public userDetails: string = "userdetails";
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public platform: Platform, public fcm: FCM, public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public http: Http, private nav: Nav, private toastCtrl: ToastController, public storage: Storage, public loadingCtrl: LoadingController) {
	}

	ngOnInit() {
		let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		this.loginform = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
			//password: new FormControl('', [Validators.required,]),
			otp: new FormControl('', Validators.required)
		});
	}

	sentotplogin() {

		debugger;
		console.log('sentotp');
		var data = this.loginform.value;
		//console.log(data);
		var regdata = {
			"email": data.email,
		};
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();
		//let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/register";
		let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/logotp";
		this.http.post(_url, regdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let result = JSON.parse(data["_body"]);

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
								this.hideotplogin = true;
								this.hidecontinue = false;
							}

						});

						toast.present();
					});
				}, (err2) => {
					loading.dismiss();
					// test
					// this one is for android device, bcz api is not working fine till now on real device
					this.hideregister = true;
					this.hideotplogin = true;
					this.hidecontinue = false;
					console.error(JSON.stringify(err2));
				});
	}


	login() {

		debugger;
		this.navCtrl.setRoot(HomePage);

		if (this.loginform.valid) {
			let data = this.loginform.value;

			// j comments
			/* this.fcm.getToken()
			  this.fcm.receive.subscribe(() => {
				console.log("token ", this.fcm.device_token);
			  })
			  this.fcm.listenToNotifications().pipe(
				 tap(msg => {
				  //show toast in app
				 })
			  )
			  .subscribe();
	   		*/
			/* this.fcm.getToken().then(token => {
				alert('token id: ' + token);      
			  }) */
			//console.log(this.fcm.getToken());
			/* let token;
			this.fcm.subscribeToTopic('all');
		   this.fcm.getToken().then(token=>{
			   console.log(token);
		   })
		   this.fcm.onNotification().subscribe(data=>{
			 if(data.wasTapped){
			   console.log("Received in background");
			 } else {
			   console.log("Received in foreground");
			 };
		   })
		   this.fcm.onTokenRefresh().subscribe(token=>{
			 console.log(token);
		   }); */

			let logindata = {
				"email": data.email,
				//"password":data.password,
				"devicetoken": 'sam',
				"otp": data.otp
			};

			// verifying that enter otp is correct
			let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/login";
			this.http.post(_url, logindata, { headers: this.headers })
				.subscribe(
					(data) => {

						let result = JSON.parse(data["_body"]);
						if (result.status == "failed") {
							let loading = this.loadingCtrl.create({
								content: 'Please wait...',
								duration: 1000
							});

							loading.present();
							loading.onDidDismiss(() => {
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
							});
						} else {
							// set the user details to localstorage
							// this.storage.set(this.userDetails, result);
							let loading = this.loadingCtrl.create({
								content: 'Please wait...',
								duration: 1000
							});

							loading.present();
							loading.onDidDismiss(() => {
								let toast = this.toastCtrl.create({
									message: result.message,
									duration: 1000,
									position: 'top',
									cssClass: "customtoast",
								});

								toast.onDidDismiss(() => {
									console.log('Log in toast');
									//console.log(result);
									if (result.message == "You are successfully logged in.") {

										this.loginform.reset();
										//this.navCtrl.setRoot(HomePage);
										//window.location.reload();
										this.storage.ready().then(() => {
											this.storage.set(this.userDetails, result).then(() => {
												this.storage.get('userdetails').then((value) => {
													console.log(value); // is empty...
													console.log(result.userdetails.profile_update_status); // is empty...
													if (result.userdetails.profile_update_status > 0) {
														this.navCtrl.setRoot(HomePage);
													}
													else {
														this.navCtrl.setRoot(HomePage);
														//this.navCtrl.setRoot(ProfilePage);

													}


												});

											});
										});
									} else {
										// fake login for browser, bcz on browser apis are working fine but otp not receiving on mail
										this.fakeLogin();
									}

								});
								toast.present();
							});
						}
					}, (err) => {
						// fake login for android, bcz for now api is not working for android
						this.fakeLogin();
					});
		}
	}

	fakeLogin() {
		//test
		console.log('error while verifying otp::now faking login ');
		this.loginform.reset();
		var dummyData = {
			status: "ok",
			message: "you are successfully logged in!",
			userdetails: {
				profile_update_status: 1,
				id: 2443453
			}
		}
		this.storage.ready().then(() => {
			this.storage.set(this.userDetails, dummyData).then(() => {
				this.storage.get('userdetails').then((value) => {
					console.log(value);
					this.navCtrl.setRoot(HomePage);
				});

			});
		});
	}


	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}
	goregister() {
		this.navCtrl.push(RegisterPage);
	}
	goprofile() {
		this.navCtrl.push(ProfilePage);
	}
	goforgotpassword() {
		this.navCtrl.push(ForgotpasswordPage)
	}
	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}
}
