import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  loginWithUserNamePassword(username: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(username + '@lfs.com', password);
  }

}
