import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { domain } from '../../constants/app.constants';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  loginWithUserNamePassword(username: string, password: string) {
    if (username.indexOf("gmail.com") == -1 && username.indexOf(domain) == -1) {
      username += domain;
    }
    return this.afAuth.auth.signInWithEmailAndPassword(username, password);
  }

}
