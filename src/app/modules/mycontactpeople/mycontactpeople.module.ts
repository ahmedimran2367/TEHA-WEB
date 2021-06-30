import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MycontactpeopleRoutingModule } from './mycontactpeople-routing.module';
import { MycontactpeopleComponent } from './mycontactpeople.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { PersonsInfoComponent } from './components/persons-info/persons-info.component';
import { PersonsTilesComponent } from './components/persons-tiles/persons-tiles.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [MycontactpeopleComponent, PersonsInfoComponent, PersonsTilesComponent],
  imports: [
    CommonModule,
    MycontactpeopleRoutingModule,
    SharedModule,
    MatFormFieldModule
  ]
})
export class MycontactpeopleModule { }
