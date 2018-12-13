import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreditsProvider } from '../../providers/credits/credits';
import { Credit } from '../../model/credit';
import { User } from '../../model/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersProvider } from '../../providers/users/users';
import { CommonsProvider } from '../../providers/commons/commons';

@Component({
  selector: 'page-add-credit',
  templateUrl: 'add-credit.html',
})
export class AddCreditPage {

  allUsers: User[];

  creditObj: Credit;
  creditDocId: string;

  creditForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public creditProvider: CreditsProvider, private usersProvider: UsersProvider,
    public commonsProvider: CommonsProvider) {

    this.creditDocId = this.navParams.get("creditDocId");

    if (this.navParams.get("creditObj") != null) {
      this.creditObj = this.navParams.get("creditObj");
    } else {
      this.creditObj = this.createCreditObj();
      if (this.navParams.get("creditUserId") != null) {
        this.creditObj.userId = this.navParams.get("creditUserId");
      }
    }

    console.log(this.creditObj, this.creditDocId);

    this.creditForm = this.formBuilder.group({
      userId: [this.creditObj.userId, Validators.required],
      desc: [this.creditObj.desc, Validators.required],
      date: [this.creditObj.date, Validators.required],
      amount: [this.creditObj.amount, Validators.required],
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
    console.log('ionViewDidLoad AddCreditPage');
  }

  createCreditObj(creditObj?: Credit) {
    if (this.creditForm != null) {
      return this.creditProvider.createCreditObj(creditObj.userId, creditObj.desc, parseInt(creditObj.amount + ""), creditObj.date);
    } else {
      return this.creditProvider.createCreditObj();
    }
  }

  addUpdateCredit() {
    if (this.creditDocId != null) {
      this.updateCredit();
    }
    else {
      this.addCredit();
    }
  }


  addCredit() {
    let creditObj: Credit = this.createCreditObj(this.creditForm.value);
    console.log(creditObj);
    this.commonsProvider.showLoading();
    this.creditProvider.addCreditDocument(creditObj)
      .then(data => {
        this.commonsProvider.showAlert(
          "Success",
          "New Credit added successfully for " + creditObj.userId,
          true,
          this.navCtrl
        );
      })
      .catch(error => {
        console.error("Error", error);
      });
  }

  updateCredit() {
    let newCreditObj: Credit = this.createCreditObj(this.creditForm.value);
    console.log(newCreditObj);
    this.commonsProvider.showLoading();
    this.creditProvider.updateCreditDocument(this.creditDocId, newCreditObj)
      .then(data => {
        this.commonsProvider.showAlert(
          "Success",
          "Credit Updated successfully for " + newCreditObj.userId,
          true,
          this.navCtrl);
      })
      .catch(error => {
        console.error("Error", error);
      });
  }

}
