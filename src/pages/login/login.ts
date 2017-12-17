import { Component } from '@angular/core';
import { Platform, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { RfpListPage } from '../../pages/rfp-list/rfp-list';
import { RfbServiceProvider } from '../../providers/rfb-service/rfb-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
 })
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController, public rfbServiceProvider: RfbServiceProvider, private loadingCtrl: LoadingController, private alertCtrl:AlertController, private platform: Platform, public storage: Storage) {

    this.menuCtrl.enable(false);


  }

  public loginModel: any =  {
                              "email": "",
                              "password": "",
                              "remember_pass": true
                            };

  public loading: any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.storage.get('user info').then((value) => {
      //value ? this.favorite = true : this.favorite = false
      if (value != null)
      {
        this.rfbServiceProvider.userInfo = JSON.parse(value);
        console.log(this.rfbServiceProvider.userInfo);
        this.navCtrl.setRoot(RfpListPage);
        this.menuCtrl.enable(true);

      }

    }).catch();



  }

  doLogin() {


    this.loading = this.loadingCtrl.create({});
    this.loading.present();

    let loginParam: any = {};
    loginParam.email = this.loginModel.email;
    loginParam.password = this.loginModel.password;
    

    console.log("loginParam", loginParam);


    this.rfbServiceProvider.login(loginParam).subscribe(data => {
      
      let resData = data.json();
      this.loading.dismiss();
      if (resData.success)
      {
        //this.storage.set(`user login`, true);
        this.storage.set(`user api_token`, resData.auth_token);
        this.storage.set(`user info`, JSON.stringify(resData));

        this.rfbServiceProvider.userInfo = resData;

        this.rfbServiceProvider.api_token = resData.auth_token;
        this.navCtrl.setRoot(RfpListPage);
        this.menuCtrl.enable(true);
      }
      console.log(data);
    },
      err => {
        let resError:any = err.json();
        console.log(resError);
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: resError.message,
          buttons: ['Ok']
        });
        alert.present();
        this.loading.dismiss();
      }
    );

    
   
  }

}
