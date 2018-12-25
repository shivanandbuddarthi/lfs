import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Debt } from '../../model/debt';
import { DebtsProvider } from '../../providers/debts/debts';
import { UsersProvider } from '../../providers/users/users';
import { User } from '../../model/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonsProvider } from '../../providers/commons/commons';

@Component({
  selector: 'page-add-debt',
  templateUrl: 'add-debt.html',
})
export class AddDebtPage {

  allUsers: User[];

  debtObj: Debt;
  debtDocId: string;

  debtForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder
    , public debtProvider: DebtsProvider, private usersProvider: UsersProvider,
    public commonsProvider: CommonsProvider) {

    this.debtDocId = this.navParams.get("debtDocId");

    if (this.navParams.get("debtObj") != null) {
      this.debtObj = this.navParams.get("debtObj");
    } else {
      this.debtObj = this.createDebtObj();
      if (this.navParams.get("debtUserId") != null) {
        this.debtObj.userId = this.navParams.get("debtUserId");
      }
    }


    console.log(this.debtObj, this.debtDocId);

    this.debtForm = this.formBuilder.group({
      userId: [this.debtObj.userId, Validators.required],
      desc: [this.debtObj.desc, Validators.required],
      date: [this.debtObj.date, Validators.required],
      amount: [this.debtObj.amount, Validators.required],
    });

    this.usersProvider.getAllUsers().subscribe(
      data => {
        this.allUsers = [];
        if (data) {
          this.allUsers = data;
        }
      }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDebtPage');
  }


  createDebtObj(debtObj?: Debt) {
    if (this.debtForm != null) {
      return this.debtProvider.createDebtObj(debtObj.userId, debtObj.desc, parseInt(debtObj.amount + ""), debtObj.date);
    } else {
      return this.debtProvider.createDebtObj();
    }
  }

  addUpdateDebt() {
    if (this.debtDocId != null) {
      this.updateDebt();
    }
    else {
      this.addDebt();
    }
  }

  addDebt() {
    let debtObj: Debt = this.createDebtObj(this.debtForm.value);
    console.log(debtObj);
    this.commonsProvider.showLoading(true);
    this.debtProvider.addDebtDocument(debtObj)
      .then(data => {
        this.commonsProvider.showAlert(
          "Success",
          "New Debt added successfully for " + debtObj.userId,
          true,
          this.navCtrl
        );
        this.commonsProvider.hideLoading();
      })
      .catch(error => {
        console.error("Error", error);
        this.commonsProvider.hideLoading();
      });
  }

  updateDebt() {
    let newDebtObj: Debt = this.createDebtObj(this.debtForm.value);
    console.log(newDebtObj);
    this.commonsProvider.showLoading(true);
    this.debtProvider.updateDebtDocument(this.debtDocId, newDebtObj)
      .then(data => {
        this.commonsProvider.showAlert(
          "Success",
          "Debt Updated successfully for" + newDebtObj.userId,
          true,
          this.navCtrl);
        this.commonsProvider.hideLoading();
      })
      .catch(error => {
        console.error("Error", error);
        this.commonsProvider.hideLoading();
      });
  }


}
