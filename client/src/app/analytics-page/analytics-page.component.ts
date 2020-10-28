import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsPage } from '../shared/interfaces';
import { Chart } from '../../../node_modules/chart.js';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css'],
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;
  pending = true;
  average: number;
  allOrders: number;
  totalGain: number;

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)',
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)',
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;
      this.allOrders = data.allOrders.length;
      this.totalGain = data.totalGain;

      gainConfig.labels = data.chart.map((item) => item.label);
      gainConfig.data = data.chart.map((item) => item.gain);

      orderConfig.labels = data.chart.map((item) => item.label);
      orderConfig.data = data.chart.map((item) => item.order);

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      new Chart(gainCtx, createChartConfigBar(gainConfig));
      new Chart(orderCtx, createChartConfigBar(orderConfig));

      this.pending = false;
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfigBar({ labels, data, label, color }) {
  return {
    type: 'bar',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          backgroundColor: color,
          steppedLine: false,
          fill: false,
        },
      ],
    },
  };
}
