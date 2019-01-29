import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {


  @Input()
  loggedInUser: User;

  @Input()
  displayUser: User;;

  @Input()
  totalCredit: number;

  @Input()
  totalDebt: number;

  @Input()
  showLogout: boolean;

  @Output()
  deleteEvent = new EventEmitter<User>();

  @Output()
  updateEvent = new EventEmitter<User>();

  @Output()
  logoutEvent = new EventEmitter<User>();

  constructor() {
    console.log('Hello UserInfoComponent Component');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoComponent');
  }

}
