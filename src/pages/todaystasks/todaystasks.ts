import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { NewtaskPage } from '../newtask/newtask';
import { EditnewtaskPage } from '../editnewtask/editnewtask';
import { AddcategoryPage } from '../addcategory/addcategory';
import { CategoriesPage } from '../categories/categories';
import { GlobalProvider } from '../../providers/global/global';
import { Storage } from '@ionic/storage';
import { Http, Headers, Response } from '@angular/http';
import { TasksPage } from '../tasks/tasks';

@Component({
	selector: 'page-todaystasks',
	templateUrl: 'todaystasks.html',
})
export class TodaystasksPage {

	public UserDetails = Array();
	allTasks = Array();
	allTasksDaily = Array();
	allTasksWeekly = Array();
	allTasksMonthly = Array();
	allTasksUnassign = Array();

	urlGet: string = '';
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public loadingCtrl: LoadingController, public global: GlobalProvider, public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private storage: Storage, public http: Http, private toastCtrl: ToastController) {
		this.urlGet = global.url;
	}

	ionViewDidLoad() {
		this.storage.get("userdetails").then((userval) => {
			console.log('User details is', userval);
			this.UserDetails = userval;
		});
		console.log(this.UserDetails);
	}
	ionViewDidEnter() {
		console.log('ionViewDidLoad TasksPage');
		this.get_user_tasks();
	}
	get_user_tasks() {
		console.log(this.urlGet);
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		debugger;
		loading.present();
		let _url: string = this.urlGet + "api/v1/user/get_user_todaystask";
		let postdata = {
			'user_id': this.UserDetails['userdetails'].id
		}
		this.http.post(_url, postdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let taskList = JSON.parse(data["_body"]);
					console.log(taskList.all_tasks.daily);
					this.allTasks.push(taskList.all_tasks);
					this.allTasksDaily.push(taskList.all_tasks.daily);
					this.allTasksWeekly.push(taskList.all_tasks.weekly);
					this.allTasksMonthly.push(taskList.all_tasks.monthly);
					this.allTasksUnassign.push(taskList.all_tasks.unassigned);
					console.log(this.allTasksDaily);
					loading.dismiss();
				});

	}
	gonewtask() {
		this.navCtrl.push(NewtaskPage);
	}
	gocategories() {
		this.navCtrl.push(CategoriesPage);
	}
	edittask(id) {
		this.navCtrl.push(EditnewtaskPage, { task_id: id });
	}
	completetask(id) {
		console.log(id);
		let _url: string = this.urlGet + "api/v1/user/update_user_task_status";
		let postdata = {
			'id': id
		}
		this.http.post(_url, postdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let result = JSON.parse(data["_body"]);
					if (result.status == "failed") {

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
						let toast = this.toastCtrl.create({
							message: result.message,
							duration: 1000,
							position: 'top',
							cssClass: "customtoast",
						});

						toast.onDidDismiss(() => {
							console.log('Log in toast');
						});
						toast.present();
						this.navCtrl.push(TasksPage);
					}

				});

	}

	deletetask(id) {
		let taskdata = {
			'user_id': this.UserDetails['userdetails'].id,
			'id': id
		};
		console.log(taskdata);
		let _url: string = this.urlGet + "api/v1/user/delete_user_task";
		this.http.post(_url, taskdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let result = JSON.parse(data["_body"]);
					console.log(result);
					if (result.status == "failed") {

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
						let toast = this.toastCtrl.create({
							message: result.message,
							duration: 1000,
							position: 'top',
							cssClass: "customtoast",
						});

						toast.onDidDismiss(() => {
							console.log('Log in toast');
						});
						toast.present();
						this.navCtrl.push(TasksPage);
					}
				});
	}
	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}
}
