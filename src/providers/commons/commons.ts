import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, Loading, AlertController, NavController } from 'ionic-angular';
import { Transaction } from '../../model/transaction';

@Injectable()
export class CommonsProvider {

    loading: Loading;

    constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
        console.log('Hello CommonsProvider Provider');
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true,
            spinner: 'ios',
            duration: 3000
        });
        this.loading.present();
    }

    hideLoading() {
        this.loading.dismiss();
    }

    showAlert(title: string, message: string, goBack?: boolean, nav?: NavController) {
        this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [{
                text: 'OK',
                handler: () => {
                    goBack && nav.pop();
                }
            }]
        }).present();
    }

    showConfirm(title: string, message: string, ...handlers: any[]) {
        this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: handlers
        }).present();
    }

    sortByDate(a: Transaction, b: Transaction) {
        let c: any = new Date(a.date);
        let d: any = new Date(b.date);
        return d - c;
    }

    getUserAge(dob: string) {
        if (dob != undefined)
            return new Date().getFullYear() - (new Date(dob)).getFullYear();
    }


}
