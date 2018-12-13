import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from '@angular/fire';
import { IonicModule } from 'ionic-angular';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UsersPage } from "../pages/users/users";
import { AddUserPage } from "../pages/add-user/add-user";
import { UsersProvider } from "../providers/users/users";
import { FormsModule } from "@angular/forms";
import { CommonsModule } from "./commons.module";

@NgModule({
    declarations: [
        UsersPage,
        AddUserPage
    ],
    imports: [
        BrowserModule,
        FormsModule,
        IonicModule,
        AngularFireModule,
        AngularFirestoreModule,
        CommonsModule
    ],
    providers: [
        UsersProvider
    ],
    exports: [
        UsersPage,
        AddUserPage
    ],
    entryComponents: [
        UsersPage,
        AddUserPage
    ]
})
export class UsersModule { }