import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DebtsProvider } from '../../providers/debts/debts';
import { Debt } from '../../model/debt';
import { AddDebtPage } from '../add-debt/add-debt';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';
import { CommonsProvider } from '../../providers/commons/commons';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-debts',
  templateUrl: 'debts.html',
  providers: [NativeStorage]
})
export class DebtsPage {

  public debts: Debt[];
  public totalDebt: number;

  loggedInUser: User;
  transactionListconfig: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, private platform: Platform,
    private debtsProvider: DebtsProvider, private usersProvider: UsersProvider
    , private commonsProvider: CommonsProvider) {

    this.platform.ready()
      .then(readySource => {
        this.commonsProvider.showLoading();
        this.getLoggedInUser(readySource, this);
      });
  }

  getLoggedInUser(readySource: string, debtsPage: DebtsPage) {
    if (readySource == "dom") {
      if (window.localStorage.getItem('loggedInUser')) {
        debtsPage.getUser(JSON.parse(window.localStorage.getItem('loggedInUser')).email);
      }
    }
    else {
      debtsPage.nativeStorage.getItem('loggedInUser')
        .then(data => {
          console.log(data);
          debtsPage.getUser(data.email);
          /*debtsPage.loggedInUser = data;

          debtsPage.transactionListconfig = {
            showUser: debtsPage.loggedInUser.admin,
            showButtons: debtsPage.loggedInUser.admin
          }
          console.log(debtsPage.loggedInUser)
          debtsPage.getDebts();*/
        }, error => {
          console.error(error);
        });
    }
  }

  getUser(userId: string) {
    this.usersProvider.getUser(userId).subscribe(
      data => {
        if (data) {
          this.loggedInUser = <User>data[0];

          this.transactionListconfig = {
            showUser: this.loggedInUser.admin,
            showButtons: this.loggedInUser.admin
          }
          console.log(this.loggedInUser)
          this.getDebts();
        } else {
          console.error('user doesn\'t exist');
        }
      },
      error => {
        console.error(error);
      }
    );

  }



  getDebts() {
    this.debtsProvider.getDebts(!this.loggedInUser.admin ? this.loggedInUser.userId : null)
      .subscribe(
        data => {
          if (data != undefined) {
            this.totalDebt = 0;
            this.debts = <Debt[]>data.sort(this.commonsProvider.sortByDate);
            this.debts.map(
              (debt) => {
                this.totalDebt += <number>debt.amount;
              }, this
            );
          }
          this.commonsProvider.hideLoading();
        },
        error => {
          console.error(error);
          this.commonsProvider.hideLoading();
        }
      );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DebtsPage');
  }

  goToAddDebtPage() {
    this.navCtrl.push(AddDebtPage);
  }

  goToUpdateDebtPage(debtObj) {
    let debtDocId: string;

    this.debtsProvider.getDebtDocument(debtObj).subscribe(
      data => {
        if (data.docs.length > 0) {
          debtDocId = data.docs[0].id;
          this.navCtrl.push(AddDebtPage, { "debtObj": debtObj, "debtDocId": debtDocId });
        }
        else {
          throw new Error("Document doesn't exist");
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  deleteDebt(debtObj) {
    this.commonsProvider.showConfirm('Confirm', 'Are you sure you want to remove this transaction', {
      text: 'No'
    }, {
        text: 'Yes',
        handler: () => {
          this.deleteDebtConfirm(debtObj)
        }
      });
  }

  deleteDebtConfirm(debtObj) {
    this.commonsProvider.showLoading(true);
    this.debtsProvider.getDebtDocument(debtObj).subscribe(
      data => {
        if (data.docs.length > 0) {
          this.debtsProvider.deleteDebtDocument(data.docs[0].id)
            .then(data => {
              this.commonsProvider.showAlert(
                "Success",
                "Debt deleted successfully for " + debtObj.userId
              );
            })
            .catch(error => {
              console.error(error);
              this.commonsProvider.showAlert("Error", error);
            });
        }
        else {
          console.error("Document doesn't exist");
        }
        this.commonsProvider.hideLoading();
      },
      error => {
        console.error(error);
        this.commonsProvider.hideLoading();
      }
    );

  }




}
