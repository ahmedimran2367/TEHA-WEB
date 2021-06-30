import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardInfo } from '../../models/dashboard-info.model';

@Component({
  selector: 'app-home-status',
  templateUrl: './home-status.component.html',
  styleUrls: ['./home-status.component.scss'],
})
export class HomeStatusComponent implements OnInit {
  @Input() dashboardData: DashboardInfo;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToAccounting(status: string): void {
    this.router.navigate(['/accounting/overview'], { state: { status } });
  }

  navigateToStockOverview(type: string, status: string): void {
    this.router.navigate(['/stockoverview/dashboard'], {
      state: { status, type },
    });
  }

  navigateToDocArchives(status: string): void {
    this.router.navigate(['/documentarchives/allbuildingsinvoice'], {
      state: { status },
    });
  }

  navigateToOrders(type: string): void {
    if (type === 'reading'){
      this.router.navigate(['/orders'], {
        state: {
          type: ['reading', 'smokeDetectorTest', 'interimReading'],
          status: ['OPEN', 'PLAN'],
        },
      });
    } else if (type === 'plumbing') {
      this.router.navigate(['/orders'], {
        state: {
          type: ['plumbing'],
          status: ['OPEN', 'PLAN'],
        },
      });
    } else {
      this.router.navigate(['/orders'], {
        state: {
          type: [ type ],
          status: ['OPEN', 'PLAN'],
        },
      });
    }
  }
  navigateToMyOffers(): void {
    this.router.navigate(['/myprofile'], {
      state: {
        selectedTabId: 4
      },
    });
  }
}
