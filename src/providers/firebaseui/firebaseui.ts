import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/auth';

import { emails } from '../../constants/app.constants';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class FirebaseuiProvider {

  ui: firebaseui.auth.AuthUI;

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello FirebaseuiProvider Provider');

    // Initialize the FirebaseUI Widget using Firebase.
    this.ui = new firebaseui.auth.AuthUI(afAuth.auth);
  }

  public static getUiConfig(loginPage: LoginPage) {
    // FirebaseUI config.
    return {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential) => {
          const user = authResult.user;
          const isNewUser = authResult.additionalUserInfo.isNewUser;
          console.log(user);
          // initialize new user
          if (isNewUser && emails.indexOf(user.email) == -1) {
            return false;
          }
          loginPage.setUserSession(user);
          return true;
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
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: "/",
      // Terms of service url.
      tosUrl: '<your-tos-url>',
      privacyPolicyUrl: '<your-pp-url>',
      popupMode: true
    };
  }

}
