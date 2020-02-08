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
// import { ListPage } from '../pages/list/list';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingsPage } from '../pages/settings/settings';
import { LoginhomePage } from '../pages/loginhome/loginhome';
import { ProfilePage } from '../pages/profile/profile';
import { WeeklycalenderPage } from '../pages/weeklycalender/weeklycalender';
import { MonthlycalenderPage } from '../pages/monthlycalender/monthlycalender';
// import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';


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
		// public fcm:FCM,
		public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, private alertCtrl: AlertController) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage, icon: 'home' },
			{ title: 'To-Do List', component: TasksPage, icon: 'list' },
			{ title: "Today's Tasks", component: TodaystasksPage, icon: 'list' },
			{ title: 'Add Task', component: NewtaskPage, icon: 'clipboard' },
			{ title: 'Calendar', component: CalendarPage, icon: 'calendar' },
			// { title: 'List', component: ListPage, icon: 'list' },
			//{ title: 'Monthly Calendar', component: ListPage },
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
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.

			//Notifications
			// this.initializeFirebase();

			// if(this.platform.is('cordova')){
			// this.fcm.subscribeToTopic('all');
			//   this.fcm.getToken().then(token=>{
			//       console.log(token);
			//   })
			//   this.fcm.onNotification().subscribe(data=>{
			//     if(data.wasTapped){
			//       console.log("Received in background");
			//     } else {
			//       console.log("Received in foreground");
			//     };
			//   })
			//   this.fcm.onTokenRefresh().subscribe(token=>{
			//     console.log(token);
			//   });
			//end notifications.

			this.storage.get("userdetails").then((val) => {
				console.log('User details is', val);
				this.UserDetails = val;
				this.splashScreen.hide();
			});
			this.initializeFirebase();
			// 
			//this.pushSetup();
			// }

		});
	}
	/* pushSetup()
   {
	 // to check if we have permission
   this.push.hasPermission()
	 .then((res: any) => {
   
	   if (res.isEnabled) {
		 console.log('We have permission to send push notifications');
	   } else {
		 console.log('We do not have permission to send push notifications');
	   }
   
	 });
   
   // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
   this.push.createChannel({
	id: "testchannel1",
	description: "My first test channel",
	// The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
	importance: 3
   }).then(() => console.log('Channel created'));
   
   // Delete a channel (Android O and above)
   this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));
   
   // Return a list of currently configured channels
   this.push.listChannels().then((channels) => console.log('List of channels', channels))
   
   // to initialize push notifications
   
   const options: PushOptions = {
	  android: {
		senderID:"361048463449"
	  },
	  ios: {
		  alert: 'true',
		  badge: true,
		  sound: 'false'
	  }
   }
   
   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
   
   pushObject.on('registration').subscribe((registration: any) => {
	 console.log('Device registered', registration)
   	
				let alert = this.alertCtrl.create({
				 title: 'Device registered',
				 subTitle: registration,
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
			 	
			 	
   });
   
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
   
   }  */
	openPage(page) {

		debugger;
		// this.nav.push(page.component)
		// console.log(page);
		// console.log(page.component.name);

		/* this.fcm.getToken().then(token => {
		  console.log("Token");
		}); */

		this.storage.get("userdetails").then((val) => {
			//console.log('User details is', val);
			this.UserDetails = val;
			console.log(this.UserDetails);
			if (page.component.name == "HomePage") {
				this.nav.setRoot(page.component);
			} else {

				// test code, to access this page without logging in
				// if (page.component.name == "WeeklycalenderPage") {
				// 	this.nav.push(page.component);
				// 	return;
				// }
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



		/* if (page.component.name == "HomePage"){
		  this.nav.setRoot(page.component);
		}else{
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
		  }else{
			this.nav.push(page.component);
		  }
		  
		} */
	}
}
