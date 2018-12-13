import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { AddUserPage } from '../add-user/add-user';
import { User } from '../../model/user';
import { HomePage } from '../home/home';
import { DebtsProvider } from '../../providers/debts/debts';
import { CreditsProvider } from '../../providers/credits/credits';
import { CommonsProvider } from '../../providers/commons/commons';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  users: User[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public usersProvider: UsersProvider, public debtsProvider: DebtsProvider, public creditsProvider: CreditsProvider,
    private commonsProvider: CommonsProvider) {
    this.getUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

  getUsers() {
    this.usersProvider.getAllUsers().subscribe(
      data => {
        this.users = data;
        for (let user of this.users) {
          this.getUserTotalAmounts(user);
        }
      },
      error => {
        console.error(error);
      }

    );
  }

  getUserTotalAmounts(user: User) {
    this.debtsProvider.getDebts(user.userId).subscribe(
      data => {
        if (data) {
          let total = 0;
          data.map(debt => total += debt.amount);
          user.totalDebt = total;
        }
      }
    );
    this.creditsProvider.getCredits(user.userId).subscribe(
      data => {
        if (data) {
          let total = 0;
          data.map(credit => total += credit.amount)
          user.totalCredit = total;
        }
      }
    );
  }

  gotToAddUserPage() {
    this.navCtrl.push(AddUserPage);
  }

  gotToUserDetailsPage(user: User) {
    this.navCtrl.push(HomePage, { 'user': user });
  }


}
