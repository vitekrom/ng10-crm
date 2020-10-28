import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MateriaInstance,
  MaterialService,
} from '../shared/classes/material.service';
import { Filter, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';

const STEP = 7;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css'],
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  offset = 0;
  limit = STEP;
  aSub: Subscription;
  orders: Order[] = [];
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MateriaInstance;
  loading = false;
  reloading = false;
  isFilterVisible = false;
  noMoreOrders = false;
  filter: Filter = {};

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    });

    this.aSub = this.ordersService.fetch(params).subscribe((orders) => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
    this.tooltip.destroy();
  }
}
