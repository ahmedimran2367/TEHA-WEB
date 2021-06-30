import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { StaticPagesComponent } from './static-pages.component'
import { SharedModule } from 'src/app/shared/shared.module';
import { TermsComponent } from './terms/terms.component';
import { FaqsComponent } from './faqs/faqs.component';
import { LegalTextComponent } from './legal-text/legal-text.component';

@NgModule({
  declarations: [StaticPagesComponent, TermsComponent, FaqsComponent, LegalTextComponent],
  imports: [
    CommonModule,
    StaticPagesRoutingModule,
    SharedModule
  ]
})
export class StaticPagesModule { }
