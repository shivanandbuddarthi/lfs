import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Transaction } from '../../model/transaction';
import { Credit } from '../../model/credit';
import { Debt } from '../../model/debt';
import { User } from '../../model/user';
import { CreditsProvider } from '../../providers/credits/credits';
import { DebtsProvider } from '../../providers/debts/debts';
import { UsersProvider } from '../../providers/users/users';
import { CommonsProvider } from '../../providers/commons/commons';
import { AddUserPage } from '../add-user/add-user';
import { AddDebtPage } from '../add-debt/add-debt';
import { AddCreditPage } from '../add-credit/add-credit';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NativeStorage]
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform,
    public creditsProvider: CreditsProvider, public debtsProvider: DebtsProvider, public usersProvider: UsersProvider,
    private commonsProvider: CommonsProvider, private nativeStorage: NativeStorage) {

    if (this.navParams.get('user') != null) {
      this.user = this.navParams.get('user');
    } else {
      this.user = this.usersProvider.getBlankUserObject();
    }
    this.platform.ready()
      .then(readySource => {
        commonsProvider.showLoading();
        this.getLoggedInUser(readySource, this);
      });
  }

  getLoggedInUser(readySource: string, homePage: HomePage) {
    if (readySource == "dom") {
      if (window.localStorage.getItem('loggedInUser')) {
        homePage.getUser(JSON.parse(window.localStorage.getItem('loggedInUser')).email);
      }
      else {
        homePage.navCtrl.setRoot(LoginPage);
      }
    }
    else {
      homePage.nativeStorage.getItem('loggedInUser')
        .then(data => {
          console.log(data);
          /*homePage.loggedInUser = data;
          if (homePage.loggedInUser.admin && homePage.user.firstName) {
            homePage.displayUser = homePage.user;
          } else {
            homePage.displayUser = homePage.loggedInUser;
          }

          homePage.transactionListconfig = {
            showUser: homePage.loggedInUser.admin,
            showButtons: homePage.loggedInUser.admin && homePage.user.firstName
          }


          homePage.getCredits();
          homePage.getDebts();
          */
          homePage.getUser(data.email);

        }, error => {
          console.error(error);
          homePage.navCtrl.setRoot(LoginPage);
        });
    }
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
        this.commonsProvider.hideLoading();
      },
      error => {
        console.log(error);
        this.commonsProvider.hideLoading();
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
    this.commonsProvider.showLoading(true);
    this.usersProvider.getUserDocument(userObj).subscribe(
      data => {
        console.log(data);
        if (data.docs.length > 0) {
          this.usersProvider.deleteUser(data.docs[0].id)
            .then(data => {
              const debtObj = this.debtsProvider.createDebtObj(userObj.userId);
              const creditObj = this.creditsProvider.createCreditObj(userObj.userId);

              this.debtsProvider.getDebtDocument(debtObj).subscribe(
                data => {
                  console.log("deleteuserDebts:", data);
                  for (let doc of data.docs) {
                    this.debtsProvider.deleteDebtDocument(doc.id)
                      .then(data => console.log("user debt deleted"))
                      .catch(err => console.error(err));
                  }
                },
              );

              this.creditsProvider.getCreditDocument(creditObj).subscribe(
                data => {
                  console.log("deleteuserCredts:", data);
                  for (let doc of data.docs) {
                    this.creditsProvider.deleteCreditDocument(doc.id)
                      .then(data => console.log("user credit deleted"))
                      .catch(err => console.error(err));
                  }

                }
              );
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
        this.commonsProvider.hideLoading();
      },
      error => {
        console.log(error);
        this.commonsProvider.hideLoading();
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
    this.commonsProvider.showLoading(true);
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
          this.commonsProvider.hideLoading();
        },
        error => {
          console.error(error);
          this.commonsProvider.hideLoading();
        }
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
          this.commonsProvider.hideLoading();
        },
        error => {
          console.error(error);
          this.commonsProvider.hideLoading();
        }
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
