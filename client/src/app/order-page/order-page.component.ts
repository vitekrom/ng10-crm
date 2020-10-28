import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  MateriaInstance,
  MaterialService,
} from '../shared/classes/material.service';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  isRoot: boolean;
  modal: MateriaInstance;
  pending = false;
  oSub: Subscription;

  @ViewChild('modal') modalRef: ElementRef;
  constructor(
    private router: Router,
    public order: OrderService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open() {
    this.modal.open();
  }
  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map((item) => {
        delete item._id;
        return item;
      }),
    };

    this.oSub = this.ordersService.create(order).subscribe(
      (newOrder) => {
        MaterialService.toast(`Заказ №${newOrder.order} добавлен`);
        this.order.clear();
      },
      (error) => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }

  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }
}
