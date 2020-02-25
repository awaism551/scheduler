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
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';


@Component({
	selector: 'page-tasks',
	templateUrl: 'tasks.html',
})
export class TasksPage {

	public UserDetails = Array();
	allCats = Array();
	allTasks = Array();
	allTasksDaily = Array();
	allTasksWeekly = Array();
	allTasksMonthly = Array();
	allTasksUnassign = Array();
	newTaskform: FormGroup;
	urlGet: string = '';
	dailyMore: boolean = false;
	weeklyMore: boolean = false;
	monthlyMore: boolean = false;
	getDailyMoreTasks: boolean = false;
	getWeeklyMoreTasks: boolean = false;
	getMonthlyMoreTasks: boolean = false;
	filterData: any = [];


	frequency: boolean = false;
	priority: boolean = false;
	category: boolean = false;
	color: boolean = false;
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	taskdata = { 'sortBy': 'frequency' }
	constructor(public global: GlobalProvider, public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private storage: Storage, public http: Http, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {
		this.urlGet = global.url;

	}

	ngOnInit() {
		this.newTaskform = new FormGroup({
			sortBy: new FormControl(''),
		});
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

	get_user_categories() {
		debugger;
		let _url: string = "http://orga-nice-app.com/api/v1/user/user_category";
		let postdata = {
			'user_id': this.UserDetails['userdetails'].id
		}
		this.http.post(_url, postdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let catList = JSON.parse(data["_body"]);
					console.log(catList);
					this.allCats.push(catList.all_category);
				});
		console.log(this.allCats);
	}

	get_user_tasks() {
		console.log(this.urlGet);
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();
		debugger;
		let _url: string = this.urlGet + "api/v1/user/get_user_task";
		let postdata = {
			'user_id': this.UserDetails['userdetails'].id
		}
		this.http.post(_url, postdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let taskList = JSON.parse(data["_body"]);
					//console.log(postdata);
					console.log(taskList.all_tasks);
					let dueDateTasks = [];
					let todayDate: Date = new Date();

					if (taskList.all_tasks.daily) {
						this.allTasksDaily = [];
						taskList.all_tasks.daily.filter(element => {
							let databaseData = new Date(element.due_date);
							if (todayDate.getDate() == databaseData.getDate()) {
								this.allTasksDaily.push(element);
								this.dailyMore = true;
							}
						});
					}

					if (taskList.all_tasks.weekly) {
						this.allTasksWeekly = [];
						taskList.all_tasks.weekly.filter(element => {
							let databaseData = new Date(element.due_date);
							if (todayDate.getDate() == databaseData.getDate()) {
								this.allTasksWeekly.push(element);
								this.weeklyMore = true;
							}
						});
					}

					if (taskList.all_tasks.monthly) {
						this.allTasksMonthly = [];
						taskList.all_tasks.monthly.filter(element => {
							let databaseData = new Date(element.due_date);
							if (todayDate.getDate() == databaseData.getDate()) {
								this.allTasksMonthly.push(element);
								this.monthlyMore = true;
							}
						});
					}

					this.allTasks.push(taskList.all_tasks);
					console.log(this.allTasks);
					if (this.allTasksDaily.length < 1 || this.getDailyMoreTasks === true) {
						if (taskList.all_tasks.daily) {
							this.allTasksDaily = [];
							taskList.all_tasks.daily.forEach(element => {
								this.allTasksDaily.push(element);
								this.dailyMore = false;
							});
						}
					}
					if (this.allTasksWeekly.length < 1 || this.getWeeklyMoreTasks === true) {
						if (taskList.all_tasks.weekly) {
							this.allTasksWeekly = [];
							taskList.all_tasks.weekly.forEach(element => {
								this.allTasksWeekly.push(element);
								this.weeklyMore = false;
							});
						}
					}

					if (this.allTasksMonthly.length < 1 || this.getMonthlyMoreTasks === true) {
						if (taskList.all_tasks.monthly) {
							this.allTasksMonthly = [];
							taskList.all_tasks.monthly.forEach(element => {
								this.allTasksMonthly.push(element);
								this.monthlyMore = false;
							});
						}
					}
					this.allTasksUnassign.push(taskList.all_tasks.unassigned);
					loading.dismiss();
					this.get_user_categories();
					this.sortByFunction();
				});

	}

	moreTaskDaily() {
		console.log('daily')
		this.getDailyMoreTasks = true;
		this.get_user_tasks();
	}
	moreTaskWeekly() {
		this.getWeeklyMoreTasks = true;
		this.get_user_tasks();
	}
	moreTaskMonthly() {
		this.getMonthlyMoreTasks = true;
		this.get_user_tasks();
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

	filterTask() {
		if (this.newTaskform.valid) {
			var data = this.newTaskform.value;
			console.log(data);
			let taskdata = {
				'user_id': this.UserDetails['userdetails'].id,
				'frequency': data.frequency,
				'priority': data.priority,
				'category': data.category,
				'color': data.color
			}
			console.log(taskdata);
			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});

			loading.present();
			let _url: string = "http://orga-nice-app.com/api/v1/user/filter_task";
			this.http.post(_url, taskdata, { headers: this.headers })
				.subscribe(
					(data) => {
						let result = JSON.parse(data["_body"]);
						console.log(result);



						this.newTaskform.reset();

						console.log(result.all_tasks.daily);

						this.allTasks = Array();
						this.allTasksDaily = Array();
						this.allTasksWeekly = Array();
						this.allTasksMonthly = Array();
						this.allTasksUnassign = Array();

						this.allTasks.push(result.all_tasks);
						this.allTasksDaily.push(result.all_tasks.daily);
						this.allTasksWeekly.push(result.all_tasks.weekly);
						this.allTasksMonthly.push(result.all_tasks.monthly);
						this.allTasksUnassign.push(result.all_tasks.unassigned);
						console.log(this.allTasksWeekly);
						loading.dismiss();




					});



		}
	}

	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}

	sortByFunction() {
		console.log(this.taskdata.sortBy);

		console.log(this.allTasks)
		if (this.allTasks.length > 0) {
			console.log('this.allTasks')
			if (this.taskdata.sortBy == 'frequency') {
				this.frequency = true;
				this.filterData = this.allTasks[0];
			} else {
				this.frequency = false;
			}

			if (this.taskdata.sortBy == 'priority') {
				this.priority = true;
				this.filterData = { "high": [], "medium": [], "low": [] }
				this.allTasks[0].daily.forEach(element => {
					if (element.priority == 'high') {
						this.filterData.high.push(element)
					}
					if (element.priority == 'medium') {
						this.filterData.medium.push(element)
					}
					if (element.priority == 'low') {
						this.filterData.low.push(element)
					}
				});

				this.allTasks[0].weekly.forEach(element => {
					if (element.priority == 'high') {
						this.filterData.high.push(element)
					}
					if (element.priority == 'medium') {
						this.filterData.medium.push(element)
					}
					if (element.priority == 'low') {
						this.filterData.low.push(element)
					}
				});

				this.allTasks[0].monthly.forEach(element => {
					if (element.priority == 'high') {
						this.filterData.high.push(element)
					}
					if (element.priority == 'medium') {
						this.filterData.medium.push(element)
					}
					if (element.priority == 'low') {
						this.filterData.low.push(element)
					}
				});
			} else {
				this.priority = false;
			}

			if (this.taskdata.sortBy == 'category') {
				this.category = true;
				this.filterData = [];
				let catNames = [];
				this.allCats[0].forEach(element => {
					catNames.push(element.category_name);
					this.filterData[element.category_name] = [];
				});

				catNames.forEach(catSingle => {
					this.allTasks[0].daily.forEach(element => {
						if (element.category == catSingle) {
							this.filterData[catSingle].push(element);
						}
					});
					this.allTasks[0].weekly.forEach(element => {
						if (element.category == catSingle) {
							this.filterData[catSingle].push(element);
						}
					});
					this.allTasks[0].monthly.forEach(element => {
						if (element.category == catSingle) {
							this.filterData[catSingle].push(element);
						}
					});
				});
			} else {
				this.category = false;
			}

			if (this.taskdata.sortBy == 'color') {
				this.color = true;
				this.filterData = { "green": [], "black": [], "blue": [], "red": [] }

				this.allTasks[0].daily.forEach(element => {
					if (element.color == 'green') {
						this.filterData.green.push(element)
					}
					if (element.color == 'black') {
						this.filterData.black.push(element)
					}
					if (element.color == 'blue') {
						this.filterData.blue.push(element)
					}
					if (element.color == 'red') {
						this.filterData.red.push(element)
					}
				});
				this.allTasks[0].weekly.forEach(element => {
					if (element.color == 'green') {
						this.filterData.green.push(element)
					}
					if (element.color == 'black') {
						this.filterData.black.push(element)
					}
					if (element.color == 'blue') {
						this.filterData.blue.push(element)
					}
					if (element.color == 'red') {
						this.filterData.red.push(element)
					}
				});
				this.allTasks[0].monthly.forEach(element => {
					if (element.color == 'green') {
						this.filterData.green.push(element)
					}
					if (element.color == 'black') {
						this.filterData.black.push(element)
					}
					if (element.color == 'blue') {
						this.filterData.blue.push(element)
					}
					if (element.color == 'red') {
						this.filterData.red.push(element)
					}
				});
			} else {
				this.color = false;
			}
		}

		console.log(this.filterData)
	}

}
