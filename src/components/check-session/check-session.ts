import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform } from 'ionic-angular/umd';

@Component({
  selector: 'check-session',
  templateUrl: 'check-session.html'
})
export class CheckSessionComponent {

  text: string;

  constructor(public platform: Platform, public nativeStorage: NativeStorage, child: Component) {
    console.log('Hello CheckSessionComponent Component');
  }

}
