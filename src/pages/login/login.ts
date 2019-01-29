import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { CommonsProvider } from '../../providers/commons/commons';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from '../../model/login';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private isDom: boolean = false;

  loginForm: FormGroup;
  loginObj: Login = {
    userId: "",
    password: ""
  }

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,
    public platform: Platform, public nativeStorage: NativeStorage,
    public commonsProvider: CommonsProvider, public authProvider: AuthProvider) {

    this.loginForm = this.formBuilder.group({
      "userId": [this.loginObj.userId, Validators.required],
      password: [this.loginObj.password, Validators.required],
    });

    this.platform.ready()
      .then(readySource => {
        console.log('Platform ready from', readySource);
        this.isDom = readySource == "dom";
        //this.firebaseUIProvider.ui.start('#firebaseui-auth-container', FirebaseuiProvider.getUiConfig(this));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginUser() {
    this.commonsProvider.showLoading(true);
    this.authProvider.loginWithUserNamePassword(this.loginForm.get("userId").value, this.loginForm.get("password").value)
      .then(data => {
        if (data.user) {
          this.setUserSession(data.user);
        } else {
          throw Error("No user found");
        }
        this.commonsProvider.hideLoading();
      }).catch(error => {
        console.log(error);
        this.commonsProvider.showAlert('Error', error);
        this.commonsProvider.hideLoading();
      });
  }

  setUserSession(user: firebase.User) {
    console.log("setusersession...");
    if (this.isDom) {
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      this.navCtrl.setRoot(TabsPage);
      this.commonsProvider.hideLoading();
    } else {
      this.nativeStorage.setItem('loggedInUser', user)
        .then(
          () => {
            console.log('User Information Stored!', user);
            this.navCtrl.setRoot(TabsPage);
            this.commonsProvider.hideLoading();
          },
          error => {
            console.error('Error storing user information', error)
            throw error;
          }
        );
    }



  }




}
