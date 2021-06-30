import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material/material.module';
import { FloatBtnComponent } from './float-btn/float-btn.component';
import { SharedModule } from '../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [ContentComponent, SidebarComponent, HeaderComponent, FloatBtnComponent],
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule,
    MaterialModule,
    MatTooltipModule
  ]
})
export class LayoutModule { }
