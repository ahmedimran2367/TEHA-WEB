import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSnackComponent } from './components/error-snack/error.component';
import { RouterModule } from '@angular/router';
import { MeterIconComponent } from './components/meter-icon/meter-icon.component';
import { SearchBarComponent } from './components//search-bar/search-bar.component';
import { SearchAutocompleteComponent } from './components/search-autocomplete/search-autocomplete.component';
import { BuildingOverviewComponent } from './components/building-overview/building-overview.component';
import { MaterialModule } from './../layout/material/material.module';
import { BuildingInfoCardComponent } from '../shared/components/building-info-card/building-info-card.component';
import { MapComponent } from './components/map-component/map-component.component';
import { SharedHelloCardComponent } from './components/shared-hello-card/shared-hello-card.component';
import { DialogComponent } from './components/dialog/dialog.component';
import {TranslateModule} from '@ngx-translate/core';
import { MeterDetailsOverviewCardComponent } from './components/meter-details-overview-card/meter-details-overview-card.component';
import { PersonOverviewCardComponent } from './components/person-overview-card/person-overview-card.component';
import { NumberCounterComponent } from './components/number-counter/number-counter.component';
import { AssignedSuccessfullySnackComponent } from './components/assigned-successfully-snack/assigned-successfully-snack.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomToolTipComponent } from './components/custom-tool-tip/custom-tool-tip.component';
import { ToolTipRenderDirective } from './directives/tool-tip-render.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { OverviewCardComponent } from './components/overview-card/overview-card.component';
import { InfoSnackComponent } from './components/info-snack/info-snack.component';
import { SafePipe } from './pipes/safe.pipe';
import { DtaPipe } from './pipes/dta.pipe';
import { ReplaceNullWithDashPipe } from './pipes/replace-null-with-dash.pipe';
import { NumericSpecialCharactersOnlyDirective } from './directives/numeric-special-characters-only.directive';
import { AlphaNumericOnlyDirective } from './directives/alpha-numeric-only.directive';
import { AlphabetOnlyDirective } from './directives/alphabet-only.directive';
import { StatusCardComponent } from './components/status-card/status-card.component';
import { GermanDecimalPipe } from './pipes/german-decimal.pipe';
import { NgxCurrencyModule } from "ngx-currency";
@NgModule({
  declarations: [
    ErrorSnackComponent,
    MeterIconComponent,
    SearchBarComponent,
    SearchAutocompleteComponent,
    BuildingOverviewComponent,
    BuildingInfoCardComponent,
    MapComponent,
    DialogComponent,
    SharedHelloCardComponent,
    MeterDetailsOverviewCardComponent,
    PersonOverviewCardComponent,
    NumberCounterComponent,
    AssignedSuccessfullySnackComponent,
    CustomToolTipComponent,
    ToolTipRenderDirective,
    NumbersOnlyDirective,
    OverviewCardComponent,
    InfoSnackComponent,
    SafePipe,
    DtaPipe,
    ReplaceNullWithDashPipe,
    NumericSpecialCharactersOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphabetOnlyDirective,
    StatusCardComponent,
    GermanDecimalPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TextMaskModule,
    TranslateModule,
    NgxCurrencyModule,
  ],
  exports: [
    ErrorSnackComponent,
    MeterIconComponent,
    SearchBarComponent,
    SearchAutocompleteComponent,
    BuildingOverviewComponent,
    BuildingInfoCardComponent,
    MaterialModule,
    MapComponent,
    TextMaskModule,
    DialogComponent,
    SharedHelloCardComponent,
    TranslateModule,
    MeterDetailsOverviewCardComponent,
    PersonOverviewCardComponent,
    NumberCounterComponent,
    AssignedSuccessfullySnackComponent,
    CustomToolTipComponent,
    ToolTipRenderDirective,
    NumbersOnlyDirective,
    OverviewCardComponent,
    InfoSnackComponent,
    SafePipe,
    DtaPipe,
    ReplaceNullWithDashPipe,
    NumericSpecialCharactersOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphabetOnlyDirective,
    StatusCardComponent,
    GermanDecimalPipe,
    NgxCurrencyModule,
  ]
})
export class SharedModule {}
