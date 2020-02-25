import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AddcategoryPage } from '../addcategory/addcategory';
import { Storage } from '@ionic/storage';
import { Http, Headers, Response } from '@angular/http';
/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-categories',
	templateUrl: 'categories.html',
})
export class CategoriesPage {

	UserDetails = Array();
	allCats = Array();
	empty: boolean;
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public http: Http, public toastCtrl: ToastController, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
	}


	ionViewDidLoad() {
	}

	ionViewDidEnter() {
	}


	ngOnInit() {

		this.storage.get("userdetails").then((userval) => {
			this.UserDetails = userval;
			this.get_user_categories();
		});
	}

	//get user category
	get_user_categories() {

		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		let _url: string = "http://orga-nice-app.com/api/v1/user/user_category";
		let postdata = {
			'user_id': this.UserDetails['userdetails'].id
		}
		this.http.post(_url, postdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let catList = JSON.parse(data["_body"]);
					this.allCats.push(catList.all_category);
					if (catList.status == 'failed') {
						this.empty = true;
					}
					if (this.allCats[0]) {
						if (this.allCats[0].length < 1) {
							this.empty = true;
						} else {
							this.empty = false;
						}
					} else {
						this.empty = true;
					}
					loading.dismiss();
				});
	}

	//delete category
	deleteCat(cat_id, index) {
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();
		let alert = this.alertCtrl.create({
			title: 'Confirm Delete',
			message: 'Do you want to delete this category? It will be permanently deleted!',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
					}
				},
				{
					text: 'Ok',
					handler: () => {
						let postdata = {
							'cat_id': cat_id
						}
						let _url: string = "http://orga-nice-app.com/api/v1/user/delete_category";
						this.http.post(_url, postdata, { headers: this.headers })
							.subscribe(
								(data) => {
									let result = JSON.parse(data["_body"]);
									if (result.status == "failed") {
										loading.dismiss();
										loading.onDidDismiss(() => {
											let toast = this.toastCtrl.create({
												message: result.message,
												duration: 1000,
												position: 'top',
												cssClass: "customtoast",
											});
											toast.onDidDismiss(() => {
											});
											toast.present();
										});
									} else {
										/* let loading = this.loadingCtrl.create({
										  content: 'Please wait...',
										  duration: 1000
										});
					
										loading.present(); */
										loading.dismiss();
										this.allCats[0].splice(index, 1);
										if (this.allCats[0]) {
											if (this.allCats[0].length < 1) {
												this.empty = true;
											} else {
												this.empty = false;
											}
										} else {
											this.empty = true;
										}
										loading.onDidDismiss(() => {
											let toast = this.toastCtrl.create({
												message: result.message,
												duration: 1000,
												position: 'top',
												cssClass: "customtoast",
											});

											toast.onDidDismiss(() => {

											});
											toast.present();
										});
									}
								});
					}
				}
			]
		});
		alert.present();

	}

	//go to add category view
	goAddcategory() {
		this.navCtrl.push(AddcategoryPage);
	}
}
