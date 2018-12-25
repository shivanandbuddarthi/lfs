import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersProvider } from '../../providers/users/users';
import { User } from '../../model/user';
import { domain } from '../../constants/app.constants';
import { CommonsProvider } from '../../providers/commons/commons';

@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {

  private userForm: FormGroup;

  private userDocId: string;
  private userObj: User;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private userProvider: UsersProvider,
    private commonsProvider: CommonsProvider
  ) {


    this.userDocId = this.navParams.get('userDocId');

    if (this.navParams.get('userObj') != null) {
      this.userObj = this.navParams.get('userObj');
    } else {
      this.userObj = this.userProvider.getBlankUserObject();
    }

    console.log(this.userDocId, this.userObj);

    this.userForm = this.formBuilder.group({
      firstName: [this.userObj.firstName, Validators.required],
      lastName: [this.userObj.lastName, Validators.required],
      email: [this.userObj.email, Validators.email],
      phoneNumber: [this.userObj.phoneNumber, Validators.pattern('[0-9]{10}')],
      gender: [this.userObj.gender],
      dateOfBirth: [this.userObj.dateOfBirth]
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUserPage');
  }

  addUpdateUser() {
    if (this.userDocId != null) {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  addUser() {
    let userObj: User = this.userForm.value;
    userObj.userId = userObj.firstName.toLowerCase().replace(" ", "") + domain;
    console.log(userObj);
    this.commonsProvider.showLoading(true);
    this.userProvider.addUser(userObj)
      .then(
        data => {
          console.log(data);
          this.commonsProvider.showAlert(
            'Success',
            'User Added successfully...',
            true, this.navCtrl);
          this.commonsProvider.hideLoading();
        }
      )
      .catch(
        error => {
          console.log(error);
          this.commonsProvider.showAlert('Error', error);
          this.commonsProvider.hideLoading();
        }
      );
  }

  updateUser() {
    let newUserObj = this.userForm.value;
    console.log(newUserObj);
    this.commonsProvider.showLoading(true);
    this.userProvider.updateUser(this.userDocId, newUserObj)
      .then(data => {
        this.commonsProvider.showAlert(
          "Success",
          "User Updated successfully",
          true, this.navCtrl);
        this.commonsProvider.hideLoading();
      })
      .catch(error => {
        this.commonsProvider.showAlert("Error", error);
        this.commonsProvider.hideLoading();
      });
  }
}
