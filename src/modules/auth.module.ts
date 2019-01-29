import { NgModule } from "@angular/core";
import { AuthProvider } from "../providers/auth/auth";
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { LoginPage } from "../pages/login/login";
import { NativeStorage } from "@ionic-native/native-storage";

@NgModule({
    declarations: [
        LoginPage
    ],
    imports: [
        BrowserModule,
        IonicModule,
        AngularFireModule,
        AngularFireAuthModule
    ],
    providers: [
        AuthProvider,
        //FirebaseuiProvider,
        NativeStorage
    ],
    exports: [
        LoginPage
    ],
    entryComponents: [
        LoginPage
    ]
})
export class AuthModule { }