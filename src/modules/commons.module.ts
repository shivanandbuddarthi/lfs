import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { TransactionListComponent } from "../components/transaction-list/transaction-list";
import { FormsModule } from "@angular/forms";
import { CommonsProvider } from "../providers/commons/commons";

@NgModule({
    declarations: [TransactionListComponent],
    imports: [
        BrowserModule,
        IonicModule,
        FormsModule
    ],
    providers: [
        CommonsProvider
    ],
    exports: [TransactionListComponent],
    entryComponents: []
})
export class CommonsModule { }