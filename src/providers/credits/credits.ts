import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Credit } from '../../model/credit';

@Injectable()
export class CreditsProvider {
  constructor(private db: AngularFirestore) {
  }

  createCreditObj(creditUser?: string, creditDesc?: string, creditAmount?: number, creditDate?: string) {
    let credit: Credit = {
      userId: creditUser,
      desc: creditDesc,
      amount: creditAmount,
      date: creditDate,
      type: 'Cr'
    }
    return credit;
  }

  getCredits(userId?: string) {
    return this.db.collection<Credit>('credits', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (userId != null) {
        query = query.where('userId', '==', userId)
      }
      return query;
    }).valueChanges();
  }

  getCreditDocument(creditObj: Credit) {
    return this.db.collection('credits', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (creditObj.userId != null) { query = query.where('userId', '==', creditObj.userId) };
      if (creditObj.desc != null) { query = query.where('desc', '==', creditObj.desc) };
      if (creditObj.date != null) { query = query.where('date', '==', creditObj.date) };
      if (creditObj.amount != null) { query = query.where('amount', '==', creditObj.amount) };
      return query;
    }).get()
  }


  addCreditDocument(creditObj: Credit) {
    return this.db.collection('credits').add(creditObj);
  }

  updateCreditDocument(docId: string, newObj: Credit) {
    return this.db.doc<Credit>('/credits/' + docId).update(newObj);
  }

  deleteCreditDocument(docId: string) {
    return this.db.doc<Credit>('/credits/' + docId).delete();
  }



}
