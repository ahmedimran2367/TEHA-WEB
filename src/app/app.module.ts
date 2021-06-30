import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from './shared/services/translation.service';
import { Injector } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeENDE from '@angular/common/locales/en-DE';

registerLocaleData(localeENDE);
@NgModule({
  declarations: [AppComponent],
  imports: [
    // angular
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatProgressBarModule,
    NgHttpLoaderModule.forRoot(),

    // Core and Shared
    CoreModule.forRoot({ userName: 'Miss Marple' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationService,

      }
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'en-de' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function appInitializerFactory(translate: TranslateService): any {
  return () => {
    translate.addLangs(['en', 'de']);
    let lang = JSON.parse(localStorage.getItem('currentUserLang'));
    return translate.use(lang?.match(/en|de/) ? lang : 'de').toPromise();
    // translate.setDefaultLang('en');
    //  return translate.use('en').toPromise();
  };
}
