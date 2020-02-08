import { Component } from '@angular/core';
import { NavController, PopoverController, Nav, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { ToastController, AlertController  } from 'ionic-angular';

import { LoginhomePage } from '../loginhome/loginhome';
import { TasksPage } from '../tasks/tasks';
import { TodaystasksPage } from '../todaystasks/todaystasks';
import { SettingsPage } from '../settings/settings';
import { CalendarPage } from '../calendar/calendar';
import { DashboardPage } from '../dashboard/dashboard';
import { QuicknotesPage } from '../quicknotes/quicknotes';
import { NewtaskPage } from '../newtask/newtask';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  app 
  UserDetails = Array();
  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, private network: Network, private storage: Storage, private toastCtrl: ToastController, private alertCtrl: AlertController, public nav: Nav, public loadingCtrl: LoadingController) {

  }
  // network
  ionViewDidLoad(){
    this.storage.get("userdetails").then((userval) => {
      //console.log('User details is', userval);
      this.UserDetails = userval;
      console.log(this.UserDetails);
    });
    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('i am in home.ts file');
      console.log('network was disconnected :-(');
    });

    // stop disconnect watch
    disconnectSubscription.unsubscribe();


    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 1000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();
  }


  // logout
  logout(){
    this.storage.clear();
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        duration: 1000
      });

      loading.present();
      loading.onDidDismiss(() => {
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
        let toast = this.toastCtrl.create({
          message: "You are successfully logged out.",
          duration: 1000,
          position: 'top',
          cssClass: "customtoast",
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
          //window.location.reload();
        });

        toast.present();
      });

  }
  //end log out.
  
  goTologinhome(){
	  this.navCtrl.push(LoginhomePage);
  }
  goTotasks(){
    if (this.UserDetails == null){
      let alert = this.alertCtrl.create({
        title: 'Please Login!',
        subTitle: 'You need to login to your account to view your To-Dos.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.push(LoginhomePage);
            }
          }
        ]
      });
      alert.present();
    }else{
      this.navCtrl.push(TasksPage);
    }
    
  }
  gosettings(){
	  this.navCtrl.push(SettingsPage);
  }
  todaystask()
  {
	  
	  if (this.UserDetails == null) {
      let alert = this.alertCtrl.create({
        title: 'Please Login!',
        subTitle: 'You need to login to your account to view your To-Dos.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.push(LoginhomePage);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push(TodaystasksPage);
    }
  }
  gocalendar(){
    if (this.UserDetails == null) {
      let alert = this.alertCtrl.create({
        title: 'Please Login!',
        subTitle: 'You need to login to your account to view your To-Dos.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.push(LoginhomePage);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push(CalendarPage);
    }
	  //this.navCtrl.push(CalendarPage);
  }
  godashboard(){
	  this.navCtrl.push(DashboardPage);
  }
  goquicknotes(){
    if (this.UserDetails == null) {
      let alert = this.alertCtrl.create({
        title: 'Please Login!',
        subTitle: 'You need to login to your account to view your To-Dos.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.push(LoginhomePage);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push(QuicknotesPage);
    }
  }
  goAddtask(){
    if (this.UserDetails == null) {
      let alert = this.alertCtrl.create({
        title: 'Please Login!',
        subTitle: 'You need to login to your account to view your To-Dos.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.push(LoginhomePage);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push(NewtaskPage);
    }
  }

  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
}
