import { Component } from '@angular/core';
import { NavController, NavParams, Nav, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { TasksPage } from '../tasks/tasks';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
@Component({
	selector: 'page-newtask',
	templateUrl: 'newtask.html',
})
export class NewtaskPage {

	UserDetails = Array();
	allCats = Array();
	public subtaskArray: any = [];
	data: boolean;
	private subtasksCount: number = 1;
	newTaskform: FormGroup;
	public due_date: string = new Date().toISOString();
	taskdata = { 'task_name': '', 'duration': '', 'bring_with_you': '', 'frequency': '', 'not_completed': '', 'priority': '', 'category': '', 'color': '', 'due_date': '', 'type': '' }
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public loadingCtrl: LoadingController, private nav: Nav, public navCtrl: NavController, public http: Http, public navParams: NavParams, public popoverCtrl: PopoverController, public storage: Storage, public toastCtrl: ToastController) {
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
		});
		this.taskdata.duration = "00:00";
	}
	ionViewDidLoad() {
		this.storage.get("userdetails").then((userval) => {
			console.log('User details is', userval);
			this.UserDetails = userval;
			//console.log(this.UserDetails['userdetails'].id);
		});
		console.log(this.UserDetails);
	}

	ionViewDidEnter() {
		this.get_user_categories();
	}
	//get user category
	get_user_categories() {
		let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/user_category";
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
		this.subtaskArray.push({ 'sub_task': this.subtasksCount, 'value': '' });
		console.log(this.subtaskArray);
		this.data = true;
	}

	remaovesubTask(id) {
		this.subtaskArray = this.subtaskArray.filter(element => element.sub_task != id);

		this.newTaskform.removeControl('sub_task' + id);
		console.log(this.subtaskArray);
	}

	addTask() {
		if (this.newTaskform.valid) {

			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			loading.present();


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
					'type': 'task'
				}
				console.log(taskdata);
				let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/create_task";
				this.http.post(_url, taskdata, { headers: this.headers })
					.subscribe(
						(data) => {
							loading.dismiss();
							let result = JSON.parse(data["_body"]);
							console.log(result);

							console.log('Dismissed toast');
							this.newTaskform.reset();
							//this.navCtrl.push(TasksPage);
							this.nav.push(TasksPage).then(() => {
								const startIndex = this.navCtrl.getActive().index - 1;
								this.navCtrl.remove(startIndex, 1);

								const startIndex2 = this.navCtrl.getActive().index - 2;
								this.navCtrl.remove(startIndex2, 1);

							});
							let toast = this.toastCtrl.create({
								message: result.message,
								duration: 3000,
								position: 'top'
							});

							toast.onDidDismiss(() => {
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
				let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/create_task";
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
