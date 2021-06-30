import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaticPagesComponent } from './static-pages.component';

const routes: Routes = [
  {
    path: '',
    component: StaticPagesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
