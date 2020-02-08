import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { SetpasswordPage } from '../setpassword/setpassword';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  forgotpasswordForm:FormGroup;
  forgotpasswordData = {'email':''};
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private toastCtrl: ToastController, public loadingCtrl: LoadingController, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.forgotpasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)])
    });
  }


  gosetpassword(){
    this.navCtrl.push(SetpasswordPage);
  }
  
  forgotpassword(){
    if (this.forgotpasswordForm.valid) {
      var data = this.forgotpasswordForm.value;
      var forgot_password_data = {
        'email': data.email
      };

      let _url: string = "http://ec2-52-59-226-149.eu-central-1.compute.amazonaws.com/api/v1/user/forgot_password";
      this.http.post(_url, forgot_password_data, { headers: this.headers })
        .subscribe(
          (data) => {
            let result = JSON.parse(data["_body"]);
            //console.log(result);
            if (result.status == "failed") {

              let loading = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 4000
              });

              loading.present();
              loading.onDidDismiss(() => {
                let toast = this.toastCtrl.create({
                  message: result.message,
                  duration: 3000,
                  position: 'top',
                  cssClass: "customtoast",
                });
                toast.onDidDismiss(() => {
                  console.log('Dismissed toast');
                });
                toast.present();
              });
            } else {
              let userdata = {
                'email': result.user_email,
                'user_otp': result.otp
              }
              this.storage.set('user_data', userdata);
              let loading = this.loadingCtrl.create({
                content: 'Please wait...',
                duration: 4000
              });

              loading.present();
              loading.onDidDismiss(() => {
                let toast = this.toastCtrl.create({
                  message: result.message,
                  duration: 3000,
                  position: 'top',
                  cssClass: "customtoast",
                });

                toast.onDidDismiss(() => {
                  console.log('Log in toast');
                  //console.log(result);
                  this.navCtrl.push(SetpasswordPage);
                });
                toast.present();
              });
            }
          });

    }
  }
}
