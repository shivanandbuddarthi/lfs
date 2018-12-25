import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


import firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { NavController } from 'ionic-angular/umd';


@Injectable()
export class AuthBkpProvider {

  ui: firebaseui.auth.AuthUI

  constructor(public afAuth: AngularFireAuth, public navCtrl: NavController) {
    console.log('Hello AuthProvider Provider');
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  }

  loginWithUserNamePassword(username: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(username + '@lfs.com', password);
  }

  public static getUiConfig() {
    // FirebaseUI config.
    return {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential) => {
          const user = authResult.user;
          const isNewUser = authResult.additionalUserInfo.isNewUser;

          // initialize new user
          if (isNewUser) {
            // do initialization stuff here (ex. create profile)
            console.log("new user...");
            return false;
          }

          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          console.log(user);
          return false
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: 'select_account'
          }
        }, /*{
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: [
            'public_profile',
            'email'
          ]
        },
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,*/
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID // not available for Ionic apps
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: '<your-pp-url>'
    };
  }

}
