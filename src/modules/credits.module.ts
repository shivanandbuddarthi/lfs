import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from '@angular/fire';
import { IonicModule } from 'ionic-angular';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { CreditsProvider } from "../providers/credits/credits";
import { CreditsPage } from "../pages/credits/credits";
import { AddCreditPage } from "../pages/add-credit/add-credit";
import { CommonsModule } from "./commons.module";



@NgModule({
    declarations: [
        CreditsPage,
        AddCreditPage
    ],
    imports: [
        BrowserModule,
        IonicModule,
        AngularFireModule,
        AngularFirestoreModule,
        CommonsModule
    ],
    providers: [
        CreditsProvider,
    ],
    exports: [
        CreditsPage,
        AddCreditPage
    ],
    entryComponents: [
        CreditsPage,
        AddCreditPage
    ]
})
export class CreditsModule { }