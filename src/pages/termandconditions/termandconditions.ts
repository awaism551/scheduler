import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,ToastController,LoadingController} from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';


import { GlobalProvider } from '../../providers/global/global';
import { Storage } from '@ionic/storage';
import { Http, Headers, Response } from '@angular/http';


/**
 * Generated class for the TermandconditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-termandconditions',
  templateUrl: 'termandconditions.html',
})
export class TermandconditionsPage {
//pdfSrc:any;
private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(public loadingCtrl: LoadingController,public global: GlobalProvider,public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,private storage: Storage, public http: Http, private toastCtrl:ToastController) {
    //this.urlGet = global.url;
	//pdfSrc: string = '/Mobile-App-Terms.pdf';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermandconditionsPage');
  }

  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
}
