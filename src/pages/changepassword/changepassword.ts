import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-changepassword',
	templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

	changepassform: FormGroup;
	changepassdata = { "oldpassword": "", "newpassword": "", "cnfnewpassword": "" };
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	public UserDetails = Array();
	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public storage: Storage, private toastCtrl: ToastController) {
	}

	ngOnInit() {
		this.changepassform = new FormGroup({
			oldpassword: new FormControl('', [Validators.required]),
			newpassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
			cnfnewpassword: new FormControl('', [Validators.required]),
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ChangepasswordPage');
		this.storage.get("userdetails").then((userval) => {
			console.log('User details is', userval);
			this.UserDetails = userval;
			//console.log(this.UserDetails['userdetails'].id);
		});
		console.log(this.UserDetails);
	}

	changePassword() {
		let user_id = this.UserDetails['userdetails'].id;
		let encrypt_old_password = this.UserDetails['userdetails'].password;
		if (this.changepassform.valid) {
			var data = this.changepassform.value;
			console.log(data);
			var pass_change_data = {
				"user_id": user_id,
				"encrypt_old_password": encrypt_old_password,
				"entered_old_password": data.oldpassword,
				"new_password": data.newpassword
			};

			let _url: string = "http://orga-nice-app.com/api/v1/user/change_password";
			this.http.post(_url, pass_change_data, { headers: this.headers })
				.subscribe(
					(data) => {
						let result = JSON.parse(data["_body"]);
						//console.log(result);
						if (result.status == "failed") {

							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 3000,
								position: 'top',
								cssClass: "customtoast",
							});
							toast.onDidDismiss(() => {
								console.log('Dismissed toast');
							});
							toast.present();
						} else {
							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 3000,
								position: 'top',
								cssClass: "customtoast",
							});

							toast.onDidDismiss(() => {
								console.log('change password in toast');
								//console.log(result);
								this.changepassform.reset();
							});
							toast.present();
						}
					});
		}
	}

}
