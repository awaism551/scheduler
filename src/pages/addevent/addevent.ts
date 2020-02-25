import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { TasksPage } from '../tasks/tasks';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { CalendarPage } from '../calendar/calendar';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the AddeventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-addevent',
	templateUrl: 'addevent.html',
})
export class AddeventPage {



	UserDetails = Array();
	allCats = Array();
	public subtaskArray: any = [];
	data: boolean;
	private subtasksCount: number = 1;
	newTaskform: FormGroup;
	public due_date: string = new Date().toISOString();
	taskdata = { 'task_name': '', 'duration': '', 'bring_with_you': '', 'frequency': '', 'not_completed': '', 'priority': '', 'category': '', 'color': '', 'due_date': '', 'reminders': '', 'minutes_before': '', 'repetition': '', 'type': '' }
	private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams, public popoverCtrl: PopoverController, public storage: Storage, public toastCtrl: ToastController) {
	}

	ngOnInit() {
		this.newTaskform = new FormGroup({
			task_name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
			duration: new FormControl('', [Validators.required]),
			bring_with_you: new FormControl(''),
			// frequency: new FormControl('', [Validators.required]),
			// not_completed: new FormControl('', [Validators.required]),
			// priority: new FormControl('', [Validators.required]),
			// category: new FormControl('', [Validators.required]),
			//color: new FormControl('', [Validators.required]),
			due_date: new FormControl('', [Validators.required]),
			// sub_task1: new FormControl(),
			//reminders:new FormControl('', [Validators.required]),
			minutes_before: new FormControl('', [Validators.required]),
			repetition: new FormControl('', [Validators.required]),
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

	remaovesubTask() {
		var arrlength = this.subtaskArray.length;
		this.subtaskArray.splice(0, 1);
		if (arrlength == 1) {
			this.data = false;
		}
		this.newTaskform.removeControl('sub_task' + this.subtasksCount);
		console.log(this.subtaskArray);
	}

	addTask() {
		if (this.newTaskform.valid) {
			var data = this.newTaskform.value;
			let taskdata = {
				'user_id': this.UserDetails['userdetails'].id,
				'task_name': data.task_name,
				'duration': data.duration,
				'bring_with_you': data.bring_with_you,
				'frequency': '',
				'if_not_completed': '',
				'priority': '',
				'category': '',
				'color': '',
				'due_date': data.due_date,
				'sub_tasks': '',
				'reminders': data.reminders,
				'minutes_before': data.minutes_before,
				'repetition': data.repetition,
				'type': 'event'
			}
			console.log(taskdata);
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
							this.navCtrl.push(CalendarPage);
						});

						toast.present();
					});

		}
	}

}
