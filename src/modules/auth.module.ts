import { NgModule } from "@angular/core";
import { AuthProvider } from "../providers/auth/auth";
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { LoginPage } from "../pages/login/login";

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
    ],
    exports: [
        LoginPage
    ],
    entryComponents: [
        LoginPage
    ]
})
export class AuthModule { }