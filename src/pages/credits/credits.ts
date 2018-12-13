import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddCreditPage } from '../add-credit/add-credit';
import { CreditsProvider } from '../../providers/credits/credits';
import { Credit } from '../../model/credit';
import { User } from '../../model/user';
import { CommonsProvider } from '../../providers/commons/commons';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the CreditsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class CreditsPage {

  public credits: Credit[];
  public totalCredit: number;

  loggedInUser: User;
  transactionListconfig: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private creditsProvider: CreditsProvider, private usersProvider: UsersProvider
    , private commonsProvider: CommonsProvider) {
    this.getUser(window.sessionStorage.getItem('userId'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreditsPage');
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
          this.getCredits();
        } else {
          console.error('user doesn\'t exist');
        }
      },
      error => {
        console.error(error);
      }
    );

  }

  getCredits() {
    this.creditsProvider.getCredits(!this.loggedInUser.admin ? this.loggedInUser.userId : null)
      .subscribe(
        data => {
          if (data != undefined) {
            this.totalCredit = 0;
            this.credits = <Credit[]>data.sort(this.commonsProvider.sortByDate);
            this.credits.map(
              (debt) => {
                this.totalCredit += <number>debt.amount;
              }, this
            );
          }
        }
      );
  }

  goToAddCreditPage() {
    this.navCtrl.push(AddCreditPage);
  }

  goToUpdateCreditPage(creditObj) {
    let creditDocId: string;
    this.creditsProvider.getCreditDocument(creditObj).subscribe(
      data => {
        if (data.docs.length > 0) {
          creditDocId = data.docs[0].id;
          this.navCtrl.push(AddCreditPage, { "creditObj": creditObj, "creditDocId": creditDocId });
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

  deleteCredit(creditObj) {
    this.commonsProvider.showConfirm('Confirm', 'Are you sure you want to remove this transaction', {
      text: 'No'
    }, {
        text: 'Yes',
        handler: () => {
          this.deleteCreditConfirm(creditObj)
        }
      });
  }

  deleteCreditConfirm(creditObj) {
    this.commonsProvider.showLoading();
    this.creditsProvider.getCreditDocument(creditObj).subscribe(
      data => {
        if (data.docs.length > 0) {
          this.creditsProvider.deleteCreditDocument(data.docs[0].id)
            .then(data => {
              this.commonsProvider.showAlert(
                "Success",
                "Credit deleted successfully for " + creditObj.userId
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
      },
      error => {
        console.error(error);
      }
    );

  }

}
