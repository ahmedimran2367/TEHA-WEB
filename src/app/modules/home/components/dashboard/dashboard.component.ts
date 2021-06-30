import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../home.service';
import { DashboardInfo } from '../../models/dashboard-info.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardInfo;

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.homeService.getDashboardData().subscribe((m) => {
      this.dashboardData = m.data;
      console.log('dashboard ', this.dashboardData);
    });
  }

  showPropertyOverview($event): void {
    this.router.navigate(['/stockoverview/dashboard'], {
      state: { propertyId: $event },
    });
  }
}
