import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { DebtsPage } from '../debts/debts';
import { CreditsPage } from '../credits/credits';
import { UsersPage } from '../users/users';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';

@Component({
  templateUrl: 'tabs.html',
  styles: ['./tabs.css']
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = UsersPage;
  tab3Root = DebtsPage;
  tab4Root = CreditsPage;


  loggedInUser: User;

  constructor(public usersProvider: UsersProvider) {

    this.getUser(window.sessionStorage.getItem('userId'));

  }

  getUser(userId: string) {
    this.usersProvider.getUser(userId).subscribe(
      data => {
        if (data) {
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
