import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpConfigInterceptor } from '../core/interceptors/http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultDataServiceConfig } from '../shared/services/defaultData.service';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatDialogModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  static forRoot(config: DefaultDataServiceConfig): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [{ provide: DefaultDataServiceConfig, useValue: config }],
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
