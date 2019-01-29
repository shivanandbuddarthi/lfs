import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { DebtsPage } from '../debts/debts';
import { CreditsPage } from '../credits/credits';
import { UsersPage } from '../users/users';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html',
  styles: ['./tabs.css'],
  providers: [NativeStorage]

})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = UsersPage;
  tab3Root = DebtsPage;
  tab4Root = CreditsPage;


  loggedInUser: User;

  isDom: boolean;

  constructor(public usersProvider: UsersProvider, private nativeStorage: NativeStorage,
    public platform: Platform, public navCtrl: NavController
  ) {
    this.platform.ready()
      .then(readySource => {
        console.log('Platform ready from', readySource);
        this.isDom = readySource == "dom";
        this.getLoggedInUser(this);
      });

  }

  getLoggedInUser(tabsPage: TabsPage) {
    if (tabsPage.isDom) {
      if (window.localStorage.getItem('loggedInUser')) {
        tabsPage.getUser(JSON.parse(window.localStorage.getItem('loggedInUser')).email);
      }
    }
    else {
      tabsPage.nativeStorage.getItem('loggedInUser')
        .then(data => {
          console.log(data);
          tabsPage.getUser(data.email);
          //tabsPage.loggedInUser = data;
        });
    }
  }

  getUser(userId: string) {
    this.usersProvider.getUser(userId).subscribe(
      data => {
        if (data) {
          console.log(data);
          this.loggedInUser = <User>data[0];
        } else {
          console.error('user doesn\'t exist');
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  logOut() {
    if (this.isDom) {
      window.localStorage.removeItem('loggedInUser');
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.nativeStorage.remove('loggedInUser')
        .then(
          data => {
            console.log("user data removed from storage");
            this.navCtrl.setRoot(LoginPage);
          }
        ).catch(
          err => console.error(err)
        );

    }
  }

}
