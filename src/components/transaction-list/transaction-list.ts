import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Transaction } from '../../model/transaction';

/**
 * Generated class for the TransactionListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'transaction-list',
  templateUrl: 'transaction-list.html'
})
export class TransactionListComponent {

  @Input('trasactions')
  trasactions: Transaction[];

  @Input('config')
  config: any;


  @Output()
  deleteEvent = new EventEmitter<Transaction>();

  @Output()
  updateEvent = new EventEmitter<Transaction>();

  constructor() {
    console.log('Hello TransactionListComponent Component');
  }
}
