import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public data: any = [{ "total": 0 }];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.start();
  }

  start() {
    this.dashboardService.getTotalSale().subscribe((res: any) => {
      this.data = res
    })
  }
}
