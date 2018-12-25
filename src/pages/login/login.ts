import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonsProvider } from '../../providers/commons/commons';
import { TabsPage } from '../tabs/tabs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from '../../model/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { UsersProvider } from '../../providers/users/users';
import { User } from '../../model/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [NativeStorage]
})
export class LoginPage {

  loginForm: FormGroup;
  loginObj: Login = {
    userId: "",
    password: ""
  }

  isDom: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private nativeStorage: NativeStorage, private platform: Platform,
    private usersProvider: UsersProvider,
    private authProvider: AuthProvider, private commonsProvider: CommonsProvider) {

    this.loginForm = this.formBuilder.group({
      "userId": [this.loginObj.userId, Validators.required],
      password: [this.loginObj.password, Validators.required],
    });

    this.platform.ready()
      .then(readySource => {
        console.log('Platform ready from', readySource);
        this.isDom = readySource == "dom";
        console.log(this.isDom);
        this.getLoggedInUser(readySource, this);

      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  getLoggedInUser(readySource: string, loginPage: LoginPage) {
    if (readySource == "dom") {
      if (window.localStorage.getItem('loggedInUserId')) {
        loginPage.navCtrl.setRoot(TabsPage);
      }
    }
    else {
      loginPage.nativeStorage.getItem('loggedInUser')
        .then(data => {
          console.log(data);
          loginPage.navCtrl.setRoot(TabsPage);
        });
    }
  }

  loginUser() {
    this.commonsProvider.showLoading(true);
    this.authProvider.loginWithUserNamePassword(this.loginForm.get("userId").value, this.loginForm.get("password").value)
      .then(data => {
        let userId: string = data.user.email;

        if (this.isDom) {
          window.localStorage.setItem("loggedInUserId", userId);
          this.navCtrl.push(TabsPage);
        }
        else {
          this.getUser(userId);
        }
        this.commonsProvider.hideLoading();
      }).catch(error => {
        console.log(error);
        this.commonsProvider.showAlert('Error', error);
        this.commonsProvider.hideLoading();
      });
  }

  getUser(userId: string) {
    this.usersProvider.getUser(userId).subscribe(
      data => {
        if (data) {
          this.nativeStorage.setItem('loggedInUser', <User>data[0])
            .then(
              () => {
                console.log('User Information Stored!', <User>data[0]);
                this.navCtrl.push(TabsPage);
              },
              error => {
                console.error('Error storing user information', error)
                throw error;
              }
            );
        } else {
          throw "user doesn\'t exist";
        }
      },
      error => {
        console.log(error);
      }
    );

  }



}
