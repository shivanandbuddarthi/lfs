import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { TransactionListComponent } from "../components/transaction-list/transaction-list";
import { FormsModule } from "@angular/forms";
import { CommonsProvider } from "../providers/commons/commons";
import { UserInfoComponent } from "../components/user-info/user-info";

@NgModule({
    declarations: [TransactionListComponent, UserInfoComponent],
    imports: [
        BrowserModule,
        IonicModule,
        FormsModule
    ],
    providers: [
        CommonsProvider
    ],
    exports: [TransactionListComponent, UserInfoComponent],
    entryComponents: []
})
export class CommonsModule { }