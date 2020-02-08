import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Nav,ToastController, LoadingController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { CategoriesPage } from '../categories/categories';
/**
 * Generated class for the AddcategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addcategory',
  templateUrl: 'addcategory.html',
})
export class AddcategoryPage {

  categoryForm: FormGroup;
  categoryData = {'category_name':''};
  UserDetails = Array();
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private nav: Nav,public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public http: Http, public storage: Storage, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  ngOnInit(){
    this.categoryForm = new FormGroup({
      category_name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)])
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddcategoryPage');
    this.storage.get("userdetails").then((userval) => {
      console.log('User details is', userval);
      this.UserDetails = userval;
      //console.log(this.UserDetails['userdetails'].id);
    });
    console.log(this.UserDetails);
  }

  //add category
  addCategory(){
	   let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
	     loading.present();
    let user_id = this.UserDetails['userdetails'].id;
    if(this.categoryForm.valid){
      var data = this.categoryForm.value;
      var add_category_data = {
        'user_id': user_id,
        'category_name': data.category_name
      };

      let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/add_category";
      this.http.post(_url, add_category_data, { headers: this.headers })
        .subscribe(
          (data) => {
            let result = JSON.parse(data["_body"]);
            //console.log(result);
            if (result.status == "failed") {

             

              //loading.present();
			  loading.dismiss();
              loading.onDidDismiss(() => {
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
              });
            }else {
              /* let loading = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 1000
              }); */

              //loading.present();
			  loading.dismiss();
              loading.onDidDismiss(() => {
                let toast = this.toastCtrl.create({
                  message: result.message,
                  duration: 1000,
                  position: 'top',
                  cssClass: "customtoast",
                });

                toast.onDidDismiss(() => {
                  console.log('Log in toast');
                  //console.log(result);
                  this.categoryForm.reset();
				  //this.nav.popToRoot(); 
				  //window.location.reload();
				  this.nav.push(CategoriesPage).then(() => {
					  //const index = this.nav.getActive().index;
					  //this.nav.remove(0, index);
					  const startIndex = this.navCtrl.getActive().index - 1;
                      this.navCtrl.remove(startIndex, 1);
					  
					  const startIndex2 = this.navCtrl.getActive().index - 2;
                      this.navCtrl.remove(startIndex2, 1);
					});
                });
                toast.present();
              });
            }
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

}
