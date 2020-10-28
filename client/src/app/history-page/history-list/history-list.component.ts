import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  MateriaInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css'],
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order[];

  @ViewChild('modal') modalRef: ElementRef;
  modal: MateriaInstance;

  selectedOrder: Order;

  constructor() { }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return (total += item.quantity * item.cost);
    }, 0);
  }
  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  modalClose() {
    this.modal.close();
  }

  ngOnDestroy() {
    this.modal.destroy();
  }
}
