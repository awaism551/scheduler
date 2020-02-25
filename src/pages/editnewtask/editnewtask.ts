import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { TasksPage } from '../tasks/tasks';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';

import { Storage } from '@ionic/storage';


@Component({
	selector: 'page-editnewtask',
	templateUrl: 'editnewtask.html',
})
export class EditnewtaskPage {

	UserDetails = Array();
	allCats = Array();
	taskid: any;
	duration: any;
	frequency: any;
	not_completed: any;
	priority: any;
	category: any;
	color: any;
	id: any;
	due_date: any;
	subtask: any;
	allTask = Array();
	public subtaskArray: any = [];
	data: boolean;
	private subtasksCount: number = 1;
	newTaskform: FormGroup;
	//public due_date: string = new Date().toISOString();
	taskdata = { 'task_name': '', 'duration': '', 'bring_with_you': '', 'frequency': '', 'not_completed': '', 'priority': '', 'category': '', 'color': '', 'due_date': '', 'type': '' }
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(private nav: Nav, public navCtrl: NavController, public http: Http, public navParams: NavParams, public popoverCtrl: PopoverController, public storage: Storage, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {


		this.taskid = navParams.get('task_id');
		console.log(this.taskid);

	}

	ngOnInit() {
		this.newTaskform = new FormGroup({
			task_name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(500)]),
			duration: new FormControl('', [Validators.required]),
			//bring_with_you: new FormControl('', [Validators.required]),
			bring_with_you: new FormControl(''),
			frequency: new FormControl('', [Validators.required]),
			not_completed: new FormControl('', [Validators.required]),
			priority: new FormControl('', [Validators.required]),
			category: new FormControl(''),
			color: new FormControl(''),
			//due_date: new FormControl('', [Validators.required]),
			due_date: new FormControl(''),
			sub_task1: new FormControl(),
			sub_task2: new FormControl(),
			sub_task3: new FormControl(),
			sub_task4: new FormControl(),
			sub_task5: new FormControl(),
			sub_task6: new FormControl(),
			sub_task7: new FormControl(),
			sub_task8: new FormControl(),
			sub_task9: new FormControl(),
			sub_task10: new FormControl(),
			taskid: new FormControl('', [Validators.required]),
		});
	}
	ionViewDidLoad() {
		this.storage.get("userdetails").then((userval) => {
			console.log('User details is', userval);
			this.UserDetails = userval;
			//console.log(this.UserDetails['userdetails'].id);
			this.get_user_tasks(this.taskid)
		});
		console.log(this.UserDetails);
	}

	get_user_tasks(taskid) {

		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

		let _url: string = "http://orga-nice-app.com/api/v1/user/get_user_taskbyid";
		let postdata = {
			'user_id': this.UserDetails['userdetails'].id,
			'id': taskid
		}
		this.http.post(_url, postdata, { headers: this.headers })
			.subscribe(
				(data) => {
					let taskList = JSON.parse(data["_body"]);
					//console.log(postdata);
					console.log(taskList.all_tasks[0]);
					this.allTask.push(taskList.all_tasks);

					console.log(taskList.all_tasks[0].name)
					console.log(taskList.all_tasks[0].duration)
					this.duration = taskList.all_tasks[0].duration;
					this.frequency = taskList.all_tasks[0].frequency;

					this.not_completed = taskList.all_tasks[0].if_not_completed;
					this.priority = taskList.all_tasks[0].priority;
					this.category = taskList.all_tasks[0].category;
					this.color = taskList.all_tasks[0].color;
					this.due_date = taskList.all_tasks[0].due_date;
					console.log(taskList.all_tasks[0].due_date);

					loading.dismiss();


					this.subtask = taskList.all_tasks[0].sub_tasks;
					console.log(this.subtask.length)
					for (var i = 0; i < this.subtask.length; i++) {
						console.log(this.subtask[i]);
						this.subtaskArray.push({ 'value': this.subtask[i] });
					}



				});

	}

	ionViewDidEnter() {
		this.get_user_categories();
	}
	//get user category
	get_user_categories() {
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

	gotasks() {
		this.navCtrl.push(TasksPage);
	}

	//popover cntrl
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(PopoverComponent);
		popover.present({
			ev: myEvent
		});
	}

	//add sub task
	AddsubTask() {
		this.subtasksCount++;
		this.newTaskform.addControl('sub_task' + this.subtasksCount, new FormControl());
		this.subtaskArray.push({ 'value': '' });
		console.log(this.subtaskArray);
		this.data = true;
	}

	remaovesubTask(value) {
		this.subtaskArray = this.subtaskArray.filter(element => element.value != value);

		this.newTaskform.removeControl('sub_task' + this.subtasksCount);
		console.log(this.subtaskArray);
	}

	addTask() {
		if (this.newTaskform.valid) {
			var data = this.newTaskform.value;
			console.log(data);
			if (this.subtaskArray != null) {
				let taskdata = {
					'user_id': this.UserDetails['userdetails'].id,
					'task_name': data.task_name,
					'duration': data.duration,
					'bring_with_you': data.bring_with_you,
					'frequency': data.frequency,
					'if_not_completed': data.not_completed,
					'priority': data.priority,
					'category': data.category,
					'color': data.color,
					'due_date': data.due_date,
					'sub_tasks': this.subtaskArray,
					'type': 'task',
					'id': data.taskid,
				}
				console.log(taskdata);
				let _url: string = "http://orga-nice-app.com/api/v1/user/update_task";
				this.http.post(_url, taskdata, { headers: this.headers })
					.subscribe(
						(data) => {
							let result = JSON.parse(data["_body"]);
							console.log(result);

							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 3000,
								position: 'top'
							});

							toast.onDidDismiss(() => {
								console.log('Dismissed toast');
								this.newTaskform.reset();
								//this.navCtrl.push(TasksPage);
								this.nav.push(TasksPage).then(() => {
									const startIndex = this.navCtrl.getActive().index - 1;
									this.navCtrl.remove(startIndex, 1);

									const startIndex2 = this.navCtrl.getActive().index - 2;
									this.navCtrl.remove(startIndex2, 1);

								});
							});

							toast.present();
						});

			} else {
				let taskdata = {
					'user_id': this.UserDetails['userdetails'].id,
					'task_name': data.task_name,
					'duration': data.duration,
					'bring_with_you': data.bring_with_you,
					'frequency': data.frequency,
					'if_not_completed': data.not_completed,
					'priority': data.priority,
					'category': data.category,
					'color': data.color,
					'due_date': data.due_date,
					'type': 'task'
				}
				let _url: string = "http://orga-nice-app.com/api/v1/user/create_task";
				this.http.post(_url, taskdata, { headers: this.headers })
					.subscribe(
						(data) => {
							let result = JSON.parse(data["_body"]);
							console.log(result);

							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 3000,
								position: 'top'
							});

							toast.onDidDismiss(() => {
								console.log('Dismissed toast');
								this.newTaskform.reset();
								//this.navCtrl.push(TasksPage);
								this.nav.push(TasksPage).then(() => {
									const startIndex = this.navCtrl.getActive().index - 1;
									this.navCtrl.remove(startIndex, 1);

									const startIndex2 = this.navCtrl.getActive().index - 2;
									this.navCtrl.remove(startIndex2, 1);

								});
							});

							toast.present();
						});
			}

		}
	}
}
