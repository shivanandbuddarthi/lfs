import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FirebaseuiProvider } from '../../providers/firebaseui/firebaseui';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private isDom: boolean = false;

  constructor(public firebaseUIProvider: FirebaseuiProvider, public platform: Platform, public nativeStorage: NativeStorage) {
    this.platform.ready()
      .then(readySource => {
        console.log('Platform ready from', readySource);
        this.isDom = readySource == "dom";
        this.firebaseUIProvider.ui.start('#firebaseui-auth-container', FirebaseuiProvider.getUiConfig(this));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  setUserSession(user: firebase.User) {
    console.log("setusersession...");
    if (this.isDom) {
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    } else {
      this.nativeStorage.setItem('loggedInUser', user)
        .then(
          () => {
            console.log('User Information Stored!', user);
          },
          error => {
            console.error('Error storing user information', error)
            throw error;
          }
        );
    }


  }




}
