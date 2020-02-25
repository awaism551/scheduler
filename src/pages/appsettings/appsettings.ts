import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AppsettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-appsettings',
	templateUrl: 'appsettings.html',
})

export class AppsettingsPage {
	public UserDetails = Array();
	allCats = Array();

	urlGet: string = '';
	frequency;
	priority;
	category;
	color;
	gender;

	constructor(
		private storage: Storage,
		private http: Http,
		private toastCtrl: ToastController,
		private popoverCtrl: PopoverController) {
	}

	ngOnInit() {
		if (localStorage.getItem('freuency') != null) {
			this.frequency = localStorage.getItem('freuency');
			console.log(localStorage.getItem('freuency'));
		}
		if (localStorage.getItem('priority') != null) {
			this.priority = localStorage.getItem('priority');
			console.log(localStorage.getItem('priority'));
		}
		if (localStorage.getItem('category') != null) {
			this.category = localStorage.getItem('category');
			console.log(localStorage.getItem('category'));
		}
		if (localStorage.getItem('color') != null) {
			this.color = localStorage.getItem('color');
			console.log(localStorage.getItem('color'));
		}
	}

	ionViewDidLoad() {
		this.storage.get("userdetails").then((userval) => {
			console.log('User details is', userval);
			this.UserDetails = userval;
			if (this.UserDetails) {
				this.get_user_categories();
			}
			//console.log(this.UserDetails['userdetails'].id);
		});
		console.log(this.UserDetails);
	}

	//popover cntrl
	onChange($event) {
		//console.log($event.target.value);
		let toast = this.toastCtrl.create({
			message: "Setting saved successfully.",
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}

	get_user_categories() {
		let headers: Headers = new Headers({ 'Content-Type': 'application/json' });

		let _url: string = "http://orga-nice-app.com/api/v1/user/user_category";
		let postdata = {
			'user_id': this.UserDetails['userdetails'].id
		}
		this.http.post(_url, postdata, { headers: headers })
			.subscribe(
				(data) => {
					let catList = JSON.parse(data["_body"]);
					console.log(catList);
					this.allCats.push(catList.all_category);
				});
		console.log(this.allCats);
	}

	setFreq(e) {
		console.log(e)
		localStorage.setItem('freuency', this.frequency);
		console.log(localStorage.getItem('freuency'));
	}

	setPri() {
		localStorage.setItem('priority', this.priority);
		console.log(localStorage.getItem('priority'));

	}

	setCat() {
		localStorage.setItem('category', this.category);
		console.log(localStorage.getItem('category'));

	}

	setColor() {
		localStorage.setItem('color', this.color);
		console.log(localStorage.getItem('color'));
	}

	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}
}
