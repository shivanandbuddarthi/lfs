import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { DebtsPage } from '../debts/debts';
import { CreditsPage } from '../credits/credits';
import { UsersPage } from '../users/users';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform } from 'ionic-angular';

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

  constructor(public usersProvider: UsersProvider, private nativeStorage: NativeStorage, public platform: Platform
  ) {
    this.platform.ready()
      .then(readySource => {
        console.log('Platform ready from', readySource);
        this.getLoggedInUser(readySource, this);
      });

  }

  getLoggedInUser(readySource: string, tabsPage: TabsPage) {
    if (readySource == "dom") {
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

}
