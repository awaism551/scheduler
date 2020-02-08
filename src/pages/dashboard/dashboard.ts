import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController , Nav,ToastController,LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
//import { CircleProgressComponent } from '../../../node_modules/ng-circle-progress';
import { Storage } from '@ionic/storage';
import { Http, Headers, Response } from '@angular/http';
import { GlobalProvider } from '../../providers/global/global';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  public UserDetails = Array();
  dashboard = Array();
  userdetails = Array();
  urlGet:string='';
  
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  
  constructor(private storage: Storage, public http: Http,public global: GlobalProvider,public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,private nav: Nav,private toastCtrl:ToastController,public loadingCtrl: LoadingController) {
  this.urlGet = global.url;
 }
/* ionViewWillEnter()
 {
	
 } */
  ionViewDidLoad() {
    //console.log('ionViewDidLoad DashboardPage'); 
	 this.storage.get("userdetails").then((userval) => {
      console.log('User details is', userval);
      this.UserDetails = userval;
      console.log(this.UserDetails['userdetails'].id);
	  this.userdetails.push(this.UserDetails['userdetails']);
	   this.get_dashboard();
	   console.log(this.UserDetails); 
    });
    
  }
ionViewDidEnter() {
   //this.get_dashboard();
  }
  get_dashboard(){
	  //console.log(this.urlGet);
	  let loading = this.loadingCtrl.create({
                      content: 'Please wait...'
                    });

     loading.present();
    let _url: string = this.urlGet+"api/v1/user/dashboard";
    let postdata = {
      'user_id': this.UserDetails['userdetails'].id
    }
    this.http.post(_url, postdata, { headers: this.headers })
      .subscribe(
        (data) => {
          let noteList = JSON.parse(data["_body"]);
          console.log(noteList);
          this.dashboard.push(noteList.dashboard);
		  console.log(this.dashboard);
		   loading.dismiss();
        });
    //console.log(this.allNotes);
  }

  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
}
