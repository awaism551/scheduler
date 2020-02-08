import { Component,ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonicPage, NavController, NavParams,PopoverController,ToastController,LoadingController  } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';
//import {} from  'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
import { GlobalProvider } from '../../providers/global/global';
import { Storage } from '@ionic/storage';
import { Http, Headers, Response } from '@angular/http';
import "dhtmlx-scheduler";
import {} from "@types/dhtmlxscheduler";

declare let scheduler: any;
/**
 * Generated class for the MonthlycalenderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'page-monthlycalender',
  templateUrl: 'monthlycalender.html'
})
export class MonthlycalenderPage implements OnInit{
  @ViewChild('dhx_cal_today_button') dhx_cal_today_button: ElementRef;

    public UserDetails = Array();
	allTasks = Array();
	urlGet:string='';
    private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
	
   @ViewChild("scheduler_here") schedulerContainer: ElementRef;
  constructor(public loadingCtrl: LoadingController,public global: GlobalProvider,public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,private storage: Storage, public http: Http, private toastCtrl:ToastController) {
    this.urlGet = global.url;
 }

 ionViewDidLoad() {
	this.storage.get("userdetails").then((userval) => {
      console.log('User details is', userval);
      this.UserDetails = userval;
      //console.log(this.UserDetails['userdetails'].id);
    });
    console.log('ionViewDidLoad WeeklycalenderPage');
  }
   ionViewDidEnter() {
    console.log('ionViewDidLoad TasksPage');
	this.get_user_tasks();
  }
  //popover cntrl
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
  ngOnInit(){

  }
  get_user_tasks(){

    
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    
    loading.present();
    scheduler.clearAll();
    scheduler.init(this.schedulerContainer.nativeElement, new Date(),"month");
    scheduler.config.xml_date = '%Y-%m-%d %H:%i';
    this.dhx_cal_today_button.nativeElement.innerHTML = "Current month";
        //scheduler.init(this.schedulerContainer.nativeElement, new Date(2017, 8, 1),"month");
       //scheduler.attachEvent("onDblClick", function (id, e){ alert("onDblClick"); return false; });
	   /* scheduler.attachEvent("onEmptyClick", function (id, e){ 
	   alert("Disabled!"); 
	   return false;
	   }); */
        scheduler.attachEvent('onEventAdded', (id, ev) => {
            /* this.eventService.insert(this.serializeEvent(ev, true))
                .then((response) => {
                    if (response.id !== id) {
                        scheduler.changeEventId(id, response.id);
                    }
                }); */
				console.log(ev);
        });

        scheduler.attachEvent('onEventChanged', (id, ev) => {
            //this.eventService.update(this.serializeEvent(ev));
			console.log(ev);
			 
        var start_date=this.convert(ev.start_date);
			var end_date=this.convert(ev.end_date);
			console.log(start_date);
		let taskdata = {
        'user_id': this.UserDetails['userdetails'].id,
        'taskdata': ev,
		'start_date': start_date,
		'end_date': end_date
      };
      console.log(taskdata);
      let _url: string = this.urlGet+"api/v1/user/update_user_task";
      this.http.post(_url, taskdata, { headers: this.headers })
        .subscribe(
          (data) => {
            let result = JSON.parse(data["_body"]);
            console.log(result);
            if (result.status == "failed") {

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
            } else {
                let toast = this.toastCtrl.create({
                  message: result.message,
                  duration: 3000,
                  position: 'top',
                  cssClass: "customtoast",
                });

                toast.onDidDismiss(() => {
                  console.log('Log in toast');
                });
                toast.present();
            }
          });

    
			
			  
        });

        scheduler.attachEvent('onEventDeleted', (id) => {
            //this.eventService.remove(id);
			console.log(id);
			
			let taskdata = {
        'user_id': this.UserDetails['userdetails'].id,
        'id': id
      };
      console.log(taskdata);
      let _url: string = this.urlGet+"api/v1/user/delete_user_task";
      this.http.post(_url, taskdata, { headers: this.headers })
        .subscribe(
          (data) => {
            let result = JSON.parse(data["_body"]);
            console.log(result);
            if (result.status == "failed") {

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
            } else {
                let toast = this.toastCtrl.create({
                  message: result.message,
                  duration: 3000,
                  position: 'top',
                  cssClass: "customtoast",
                });

                toast.onDidDismiss(() => {
                  console.log('Log in toast');
                });
                toast.present();
            }
          });
        });
        //scheduler.parse(this.dataset().events, "json");
        let _url: string = this.urlGet+"api/v1/user/get_user_task_calender";
		let postdata = {
		  'user_id': this.UserDetails['userdetails'].id
		}
		this.http.post(_url, postdata, { headers: this.headers })
      .subscribe(
        (data) => {
          let taskList = JSON.parse(data["_body"]);
		 
		  this.allTasks.push(taskList.all_tasks);
		    
		  
		  console.log(this.allTasks[0]);
      scheduler.parse(this.allTasks[0], "json");
      
		  loading.dismiss();
		  
        }); 

    }
	private dataset()
	{
		const events = [
					{id: 1 , start_date: '2017-09-01 00:00', end_date: '2017-09-01 03:00', text: 'Event 1'},
		            {id: 2, start_date: '2017-09-03 00:00', end_date: '2017-09-03 05:00', text: 'Event 2'}
				];
		return {events};
	}
	
  private convert(str) {
    var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
	
	 var hours  = ("0" + date.getHours()).slice(-2);
	 var min = ("0" + date.getMinutes()).slice(-2);
	  var data=[date.getFullYear(), mnth, day].join("-");
	  data=data+' '+hours+':'+min
   return data;
}
	
  /* private serializeEvent(data: any, insert: boolean = false): Event {
        const result = {};

        for (let i in data) {
            if (i.charAt(0) === '$' || i.charAt(0) === '_') {
                continue;
            }
            if (insert && i === 'id') {
                continue;
            }
            if (data[i] instanceof Date) {
                result[i] = scheduler.templates.xml_format(data[i]);
            } else {
                result[i] = data[i];
            }
        }
        return result as Event;
    } */
}
