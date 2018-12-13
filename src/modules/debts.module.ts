import { NgModule } from "@angular/core";
import { AngularFireModule } from '@angular/fire';
import { IonicModule } from 'ionic-angular';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { DebtsProvider } from "../providers/debts/debts";
import { DebtsPage } from '../pages/debts/debts';
import { AddDebtPage } from '../pages/add-debt/add-debt';
import { BrowserModule } from "@angular/platform-browser";
import { CommonsModule } from "./commons.module";



@NgModule({
    declarations: [
        DebtsPage,
        AddDebtPage
    ],
    imports: [
        BrowserModule,
        IonicModule,
        AngularFireModule,
        AngularFirestoreModule,
        CommonsModule
    ],
    providers: [
        DebtsProvider,
    ],
    exports: [
        DebtsPage,
        AddDebtPage
    ],
    entryComponents: [
        DebtsPage,
        AddDebtPage
    ]
})
export class DebtsModule { }