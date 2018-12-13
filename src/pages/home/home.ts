import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Credit } from '../../model/credit';
import { CreditsProvider } from '../../providers/credits/credits';
import { Debt } from '../../model/debt';
import { DebtsProvider } from '../../providers/debts/debts';
import { Transaction } from '../../model/transaction';
import { User } from '../../model/user';
import { UsersProvider } from '../../providers/users/users';
import { AddUserPage } from '../add-user/add-user';
import { AddDebtPage } from '../add-debt/add-debt';
import { CommonsProvider } from '../../providers/commons/commons';
import { AddCreditPage } from '../add-credit/add-credit';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  credits: Credit[] = [];
  debts: Debt[] = [];
  totalCredit: number = 0;
  totalDebt: number = 0;

  user: User;
  loggedInUser: User;
  displayUser: User;

  transactionListconfig: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public creditsProvider: CreditsProvider, public debtsProvider: DebtsProvider, public usersProvider: UsersProvider,
    private commonsProvider: CommonsProvider) {

    if (this.navParams.get('user') != null) {
      this.user = this.navParams.get('user');
    } else {
      this.user = this.usersProvider.getBlankUserObject();
    }

    this.getUser(window.sessionStorage.getItem('userId'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }



  getUser(userId: string) {
    this.usersProvider.getUser(userId).subscribe(
      data => {
        if (data) {
          this.loggedInUser = <User>data[0];

          if (this.loggedInUser.admin && this.user.firstName) {
            this.displayUser = this.user;
          } else {
            this.displayUser = this.loggedInUser;
          }

          this.transactionListconfig = {
            showUser: this.loggedInUser.admin,
            showButtons: this.loggedInUser.admin && this.user.firstName
          }
          this.getCredits();
          this.getDebts();
        } else {
          console.error('user doesn\'t exist');
        }
      },
      error => {
        console.log(error);
      }
    );

  }

  filterByUser(a: Transaction) {
    if (this.loggedInUser.admin) {
      if (this.user.userId != "") {
        return (a.userId === this.user.userId);
      } else {
        return true;
      }
    } else if (this.loggedInUser.userId != "") {
      return (a.userId === this.loggedInUser.userId);
    }
    return true;
  }

  getCredits() {
    this.creditsProvider.getCredits().subscribe(
      data => {
        this.totalCredit = 0;
        if (data != undefined) {
          this.credits = data.filter(this.filterByUser, this).sort(this.commonsProvider.sortByDate);
          this.credits.map(
            (credit) => {
              this.totalCredit += credit.amount;
            }, this
          );
        }
      },
      error => {
        console.log(error)
      }
    );
  }

  getDebts() {
    this.debtsProvider.getDebts().subscribe(
      data => {
        this.totalDebt = 0;
        if (data != undefined) {
          this.debts = data.filter(this.filterByUser, this).sort(this.commonsProvider.sortByDate);
          this.debts.map(
            (debt) => {
              this.totalDebt += debt.amount;
            }, this
          );
        }
      },
      error => {
        console.log(error)
      }
    );
  }

  goToUpdateUserPage(userObj: User) {
    let userDocId: string;
    this.usersProvider.getUserDocument(userObj).subscribe(
      data => {
        console.log(data);
        if (data.docs.length > 0) {
          userDocId = data.docs[0].id;
          this.navCtrl.push(AddUserPage, { "userObj": userObj, "userDocId": userDocId });
        }
        else {
          throw new Error("Document doesn't exist");
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteUser(userObj: User) {
    this.commonsProvider.showConfirm('Confirm', 'Are you sure you want to remove ' + userObj.firstName, {
      text: 'No'
    }, {
        text: 'Yes',
        handler: () => {
          this.deleteUserConfirm(userObj)
        }
      });
  }

  deleteUserConfirm(userObj: User) {
    this.commonsProvider.showLoading();
    this.usersProvider.getUserDocument(userObj).subscribe(
      data => {
        console.log(data);
        if (data.docs.length > 0) {
          this.usersProvider.deleteUser(data.docs[0].id)
            .then(data => {
              this.commonsProvider.showAlert("Success", "User '" + userObj.firstName + "' deleted successfully", true, this.navCtrl)
            })
            .catch(error => {
              console.log(error);
              this.commonsProvider.showAlert("Error", error);
            });
        }
        else {
          throw new Error("User doesn't exist");
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  deleteTransaction(transaction: Transaction) {
    this.commonsProvider.showConfirm(
      "Confirm",
      "Are you sure you want to remove this transaction",
      {
        text: 'No'
      }, {
        text: 'Yes',
        handler: () => {
          this.deleteTransactionConfirm(transaction)
        }
      }
    );
  }

  deleteTransactionConfirm(transaction: Transaction) {
    let docId;
    this.commonsProvider.showLoading();
    if (transaction.type.toUpperCase() == 'DR') {
      this.debtsProvider.getDebtDocument(<Debt>transaction).subscribe(
        data => {
          if (data.docs.length > 0) {
            docId = data.docs[0].id;
            this.debtsProvider.deleteDebtDocument(docId)
              .then(data => {
                this.commonsProvider.showAlert(
                  "Success",
                  "Transaction deleted successfully for " + transaction.userId
                )
              })
              .catch(
                error => console.error(error)
              )
          } else {
            throw new Error("Record not found");
          }
        },
        error => console.error(error)
      );
    } else {
      this.creditsProvider.getCreditDocument(<Credit>transaction).subscribe(
        data => {
          if (data.docs.length > 0) {
            docId = data.docs[0].id;
            this.creditsProvider.deleteCreditDocument(docId)
              .then(data => {
                this.commonsProvider.showAlert(
                  "Success",
                  "Transaction deleted successfully for " + transaction.userId
                )
              })
              .catch(
                error => console.error(error)
              )
          } else {
            throw new Error("Record not found");
          }
        },
        error => console.error(error)
      );
    }
  }

  updateTransaction(transaction: Transaction) {
    if (transaction.type.toUpperCase() == 'DR') {
      this.goToUpdateDebtPage(transaction)
    } else {
      this.goToUpdateCreditPage(transaction);
    }
  }

  goToUpdateDebtPage(debtObj: Debt) {
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
      error => console.error(error)
    );
  }

  goToUpdateCreditPage(creditObj: Credit) {
    let creditDocId: string;
    this.creditsProvider.getCreditDocument(creditObj).subscribe(
      data => {
        if (data.docs.length > 0) {
          creditDocId = data.docs[0].id;
          this.navCtrl.push(AddCreditPage, {
            "creditObj": creditObj,
            "creditDocId": creditDocId
          });
        }
        else {
          throw new Error("Document does't exist");
        }
      },
      error => console.error(error)
    );
  }

  goToAddDebtPage() {
    this.navCtrl.push(AddDebtPage, { "debtUserId": this.user.userId });
  }

  goToAddCreditPage() {
    this.navCtrl.push(AddCreditPage, { "creditUserId": this.user.userId });
  }



}
