import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { TasksPage } from '../pages/tasks/tasks';
import { TodaystasksPage } from '../pages/todaystasks/todaystasks';
import { NewtaskPage } from '../pages/newtask/newtask';
import { CalendarPage } from '../pages/calendar/calendar';
import { AddeventPage } from '../pages/addevent/addevent';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingsPage } from '../pages/settings/settings';
import { LoginhomePage } from '../pages/loginhome/loginhome';
import { ProfilePage } from '../pages/profile/profile';
import { WeeklycalenderPage } from '../pages/weeklycalender/weeklycalender';
import { MonthlycalenderPage } from '../pages/monthlycalender/monthlycalender';
import { Network } from '@ionic-native/network';

declare var FirebasePlugin: any;

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any = HomePage;

	pages: Array<{ title: string, component: any, icon: string }>;
	UserDetails = Array();
	constructor(private network: Network,
		public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, private alertCtrl: AlertController) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage, icon: 'home' },
			{ title: 'To-Do List', component: TasksPage, icon: 'list' },
			{ title: "Today's Tasks", component: TodaystasksPage, icon: 'list' },
			{ title: 'Add Task', component: NewtaskPage, icon: 'clipboard' },
			{ title: 'Calendar', component: CalendarPage, icon: 'calendar' },
			{ title: 'Add Event', component: AddeventPage, icon: 'clock' },
			{ title: 'Dashboard', component: DashboardPage, icon: 'color-palette' },
			{ title: 'Profile', component: ProfilePage, icon: 'person' },
			{ title: 'Settings', component: SettingsPage, icon: 'settings' },
			{ title: 'Weekly Calender', component: WeeklycalenderPage, icon: 'calendar' },
			{ title: 'Monthly Calender', component: MonthlycalenderPage, icon: 'calendar' }
		];

		this.network.onDisconnect().subscribe(() => {
			alert('Network was disconnected');
			console.log('Network was disconnected');
		});

	}


	initializeFirebase() {

		// console.log("cordova platforms",this.platform.is("cordova"))
		if (this.platform.is("cordova")) {
			// alert('platform cordova chala') 
			FirebasePlugin.subscribe("all");
			// alert('Fireabse Plugin chala');
			this.platform.is('android') ? this.initializeFirebaseAndroid() : this.initializeFirebaseIOS();
		}
	}
	initializeFirebaseAndroid() {
		FirebasePlugin.getToken((token => {
			// MyApp.fireAuthToken = token;
			console.log('fcm token from firebase', token)
			// this.storage.set('fcm_token', token)
		}));
		FirebasePlugin.onTokenRefresh((token => {
			// MyApp.fireAuthToken = token;
			console.log('fcm token from firebase', token)
			// this.storage.set('fcm_token', token)
		}))
		this.subscribeToPushNotifications();
	}

	initializeFirebaseIOS() {
		// alert('init firebase ios');
		// alert('init firebase permision');


		FirebasePlugin.hasPermission((hasPermission) => {
			// alert('asking for permission');
			// alert('Permison'+JSON.stringify(hasPermission))
			if (hasPermission) {
				// alert('hass permerion chala');
				FirebasePlugin.getToken((token => {
					// alert('token milla'); 
					console.log('fcm token from firebase', token);
				}));
				FirebasePlugin.onTokenRefresh((token => {
				}))
				this.subscribeToPushNotifications();
			}
			else {
				FirebasePlugin.grantPermission()
					.then(() => {
						// alert('permission granted chala');
						this.initializeFirebaseIOS();
					}, e => {
						// alert('permision error nhn mili');
					})
					.catch((error) => {
						// alert('firbase init error'+JSON.stringify(error));
						FirebasePlugin.logError(error);
					});
			}
			//  console.log("Permission is " + (hasPermission ? "granted" : "denied")); 
		});

	}

	subscribeToPushNotifications() {
		// alert('push notifications subscribe');
		FirebasePlugin.onMessageReceived((response) => {
			console.log('root', response);
			if (response.tap) {
				// alert('works');
				// alert(JSON.stringify(response));
			}
			else {
				console.log(response.body, 'bottom');
			}
		});
	}


	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleLightContent();
			this.rootPage = HomePage;

			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.

			this.storage.get("userdetails").then((val) => {
				console.log('User details is', val);
				this.UserDetails = val;
				this.splashScreen.hide();
			});

		});
	}

	openPage(page) {

		this.storage.get("userdetails").then((val) => {
			//console.log('User details is', val);
			this.UserDetails = val;
			console.log(this.UserDetails);
			if (page.component.name == "HomePage") {
				this.nav.setRoot(page.component);
			} else {


				// Reset the content nav to have just this page
				// we wouldn't want the back button to show in this scenario
				if (this.UserDetails == null) {
					let alert = this.alertCtrl.create({
						title: 'Please Login!',
						subTitle: 'You need to login to your account to view your To-Dos.',
						buttons: [
							{
								text: 'OK',
								handler: () => {
									this.nav.push(LoginhomePage);
								}
							}
						]
					});
					alert.present();
				} else {
					this.nav.push(page.component);
				}

			}
		});

		console.log(this.UserDetails);
	}
}
