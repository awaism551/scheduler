import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Nav,ToastController,LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { Storage } from '@ionic/storage';
import { Http, Headers, Response } from '@angular/http';
import { GlobalProvider } from '../../providers/global/global';

import { WritenotesPage } from '../writenotes/writenotes';
import { EditnotesPage } from '../editnotes/editnotes';
/**
 * Generated class for the QuicknotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-quicknotes',
  templateUrl: 'quicknotes.html', 
})
export class QuicknotesPage {

  public UserDetails = Array();
  allNotes = Array();
  urlGet:string='';
  
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private nav: Nav,public global: GlobalProvider,public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private storage: Storage, public http: Http, private toastCtrl:ToastController,public loadingCtrl: LoadingController)
  {
	  this.urlGet = global.url;
  }
 
 ionViewWillEnter()
 {
}
ionViewDidLoad() {
  /* this.storage.get("userdetails").then((userval) => {
    console.log('User details is', userval);
    this.UserDetails = userval;
    //console.log(this.UserDetails['userdetails'].id);
  });
  console.log(this.UserDetails); */
}

ionViewDidEnter() {
}

ngOnInit() {
  this.storage.get("userdetails").then((userval) => {
    console.log('User details is', userval);
    this.UserDetails = userval;
     //console.log(this.UserDetails['userdetails'].id);
     console.log(this.UserDetails);
     this.get_user_notes();
    });
    
  }

  get_user_notes(){
	  console.log(this.urlGet);
	  let loading = this.loadingCtrl.create({
                      content: 'Please wait...'
                    });

     loading.present();
    let _url: string = this.urlGet+"api/v1/user/getnotes";
    let postdata = {
      'user_id': this.UserDetails['userdetails'].id
    }
    this.http.post(_url, postdata, { headers: this.headers })
      .subscribe(
        (data) => {
          let noteList = JSON.parse(data["_body"]);
          console.log(noteList);
          this.allNotes.push(noteList.all_notes);
		   loading.dismiss();
        });
    console.log(this.allNotes);
  }

  //delete note
  deleteNote(note_id){

	  let loading = this.loadingCtrl.create({
                      content: 'Please wait...'
                    });

     loading.present();
    let postdata = {
      'id': note_id
    }
    console.log(postdata);
    let _url: string = this.urlGet+"api/v1/user/delete_note";
    this.http.post(_url, postdata, { headers: this.headers })
      .subscribe(
        (data) => {
          let result = JSON.parse(data["_body"]);

          console.log(note_id)
          loading.dismiss();
     
          let toast = this.toastCtrl.create({
            message: 'Your note has been deleted successfully.',
            duration: 2000,
            position: 'top',
            cssClass: "customtoast",
          });

          toast.onDidDismiss(() => {
            console.log('note delete toast');
          });
          toast.present();

          this.allNotes[0] = this.allNotes[0].filter(element => element.id != note_id);
          console.log(this.allNotes)
		  // this.navCtrl.push(QuicknotesPage)
		   
		  // this.nav.push(QuicknotesPage).then(() => {
			//   //const index = this.nav.getActive().index;
			//   //this.nav.remove(0, index);
			//   const startIndex = this.navCtrl.getActive().index - 1;
			//   this.navCtrl.remove(startIndex, 1);
			  
			// });
		  
        });
		
		
  }

  gowritenotes(){
	//  this.noteData.id=4;
    this.navCtrl.push(WritenotesPage);
  }
editNote(note_id,notes)
{
	this.navCtrl.push(EditnotesPage,{note_id:note_id});
}
  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
}
