import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../model/user';

/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersProvider {


  constructor(private db: AngularFirestore) {
  }

  getBlankUserObject() {
    let userObj: User = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      userId: '',
      admin: false,
      totalCredit: 0,
      totalDebt: 0
    }
    return userObj;
  }

  getAllUsers() {
    return this.db.collection<User>('users').valueChanges();
  }

  addUser(userObj: User) {
    return this.db.collection<User>('users').add(userObj);
  }

  updateUser(userDocId: string, newUserObj: User) {
    return this.db.doc<User>('users/' + userDocId).update(newUserObj);
  }

  deleteUser(userDocId: string) {
    return this.db.doc<User>('users/' + userDocId).delete();
  }

  getUserDocument(userObj: User) {
    return this.db.collection('users', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (userObj.userId != null) { query = query.where('userId', '==', userObj.userId) };
      return query;
    }).get()
  }

  getUser(userId: string) {
    if (userId.indexOf("gmail.com") != -1) {
      return this.getUserByEMail(userId);
    }
    else {
      return this.getUserByUserId(userId);
    }
  }

  getUserByUserId(userId: String) {
    return this.db.collection('users', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (userId != null) { query = query.where('userId', '==', userId) };
      return query;
    }).valueChanges();
  }

  getUserByEMail(email: String) {
    return this.db.collection('users', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (email != null) { query = query.where('email', '==', email) };
      return query;
    }).valueChanges();
  }



}
