import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { domain } from '../../constants/app.constants';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  loginWithUserNamePassword(username: string, password: string) {
    if (username.toLowerCase().indexOf("gmail.com") == -1 && username.toLowerCase().indexOf(domain) == -1) {
      username += domain;
    }
    return this.afAuth.auth.signInWithEmailAndPassword(username, password);
  }


}
