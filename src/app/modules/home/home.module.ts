import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { HomeStatusComponent } from './components/home-status/home-status.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
@NgModule({
  declarations: [DashboardComponent, HomeStatusComponent, NewsCardComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
