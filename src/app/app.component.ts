import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html',
  providers: [NativeStorage]
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private nativeStorage: NativeStorage) {
    platform.ready().then((readySource) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      console.log('Platform ready from', readySource);
      this.checkSession(readySource, this);

    });
  }

  checkSession(readySource: string, myApp: MyApp) {
    if (readySource == "dom") {
      if (window.localStorage.getItem('loggedInUser')) {
        myApp.rootPage = TabsPage;
      } else {
        myApp.rootPage = LoginPage;
      }
    }
    else {
      myApp.nativeStorage.getItem('loggedInUser')
        .then(data => {
          console.log(data);
          myApp.rootPage = TabsPage;
        })
        .catch(err => {
          console.error(err);
          myApp.rootPage = LoginPage;
        });
      ;
    }
  }
}
