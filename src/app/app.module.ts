import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { PopoverComponent } from '../components/popover/popover';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginhomePage } from '../pages/loginhome/loginhome';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { TasksPage } from '../pages/tasks/tasks';
import { TodaystasksPage } from '../pages/todaystasks/todaystasks';
import { NewtaskPage } from '../pages/newtask/newtask';
import { EditnewtaskPage } from '../pages/editnewtask/editnewtask';
import { AddcategoryPage } from '../pages/addcategory/addcategory';
import { SettingsPage } from '../pages/settings/settings';
import { AppsettingsPage } from '../pages/appsettings/appsettings';
import { CalendarPage } from '../pages/calendar/calendar';
import {AddeventPage} from '../pages/addevent/addevent';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { QuicknotesPage } from '../pages/quicknotes/quicknotes';
import { WritenotesPage } from '../pages/writenotes/writenotes';
import { EditnotesPage } from '../pages/editnotes/editnotes';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PrivacypoliciesPage } from '../pages/privacypolicies/privacypolicies';
import { TermandconditionsPage } from '../pages/termandconditions/termandconditions';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { SetpasswordPage } from '../pages/setpassword/setpassword';
import { RateusPage } from '../pages/rateus/rateus';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { CategoriesPage } from '../pages/categories/categories';
import { WeeklycalenderPage } from '../pages/weeklycalender/weeklycalender';
import { MonthlycalenderPage } from '../pages/monthlycalender/monthlycalender';
import { GlobalProvider } from '../providers/global/global';
import { TermPage } from '../pages/term/term';
import { PrivacypolicyPage } from '../pages/privacypolicy/privacypolicy';
import { TermsandconditionPage } from '../pages/termsandcondition/termsandcondition';
//import { FcmProvider } from '../providers/fcm/fcm';
//import { Push } from '@ionic-native/push';

//import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
  LoginhomePage,
  PopoverComponent,
	LoginPage,
	RegisterPage,
	ProfilePage,
	TasksPage,
	TodaystasksPage,
	NewtaskPage,
	EditnewtaskPage,
	AddcategoryPage,
	SettingsPage,
	AppsettingsPage,
	CalendarPage,
	AddeventPage,
  DashboardPage,
  QuicknotesPage,
  WritenotesPage,
  EditnotesPage,
  PrivacypoliciesPage,
  TermandconditionsPage,
  TermsandconditionPage,
  PrivacypolicyPage,
  TermPage,
  ForgotpasswordPage,
  SetpasswordPage,
  RateusPage,
  ChangepasswordPage,
  CategoriesPage,
  WeeklycalenderPage,
  MonthlycalenderPage
  ],
  imports: [
   //  PdfViewerModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
		 // Specify ng-circle-progress as an import
		 NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PopoverComponent,
    MyApp,
    HomePage,
    ListPage,
	LoginhomePage,
	LoginPage,
	RegisterPage,
	ProfilePage,
	TasksPage,
	TodaystasksPage,
	NewtaskPage,
	EditnewtaskPage,
	AddcategoryPage,
	SettingsPage,
	AppsettingsPage,
	CalendarPage,
	AddeventPage,
  DashboardPage,
  QuicknotesPage,
  WritenotesPage,
  EditnotesPage,
  PrivacypoliciesPage,
  TermandconditionsPage,
  TermsandconditionPage,
  PrivacypolicyPage,
  TermPage,
  ForgotpasswordPage,
  SetpasswordPage,
  RateusPage,
  ChangepasswordPage,
  CategoriesPage,
  WeeklycalenderPage,
  MonthlycalenderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	//Push,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    GlobalProvider,
	FCM,
    //FcmProvider
  ]
})
export class AppModule {}
