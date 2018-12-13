import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Debt } from '../../model/debt';
import { domain } from '../../constants/app.constants';

@Injectable()
export class DebtsProvider {

  constructor(private db: AngularFirestore) {
  }


  createDebtObj(debtUser?: string, debtDesc?: string, debtAmount?: number, debtDate?: string) {
    let debt: Debt = {
      userId: debtUser,
      desc: debtDesc,
      amount: debtAmount,
      date: debtDate,
      type: 'Dr'
    }
    return debt;
  }

  getDebts(userId?: string) {
    return this.db.collection<Debt>('debts', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (userId != null) {
        query = query.where('userId', '==', userId)
      }
      return query;
    }).valueChanges();
  }

  getDebtDocument(debtObj: Debt) {
    let usreId = debtObj.userId.indexOf(domain) > 0 ? debtObj.userId : debtObj.userId + domain;
    return this.db.collection('debts', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (debtObj.userId != null) { query = query.where('userId', '==', usreId) };
      if (debtObj.desc != null) { query = query.where('desc', '==', debtObj.desc) };
      if (debtObj.date != null) { query = query.where('date', '==', debtObj.date) };
      if (debtObj.amount != null) { query = query.where('amount', '==', debtObj.amount) };
      return query;
    }).get()
  }


  addDebtDocument(debtObj: Debt) {
    return this.db.collection('debts').add(debtObj);
  }

  updateDebtDocument(docId: string, newObj: Debt) {
    return this.db.doc<Debt>('/debts/' + docId).update(newObj);
  }

  deleteDebtDocument(docId: string) {
    return this.db.doc<Debt>('/debts/' + docId).delete();
  }

}
