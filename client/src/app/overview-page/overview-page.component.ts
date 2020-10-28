import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OverviewPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css'],
})
export class OverviewPageComponent implements OnInit {
  data$: Observable<OverviewPage>;
  yesterday = new Date();

  constructor(private service: AnalyticsService) { }

  ngOnInit() {
    this.data$ = this.service.getOverView();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }
}
