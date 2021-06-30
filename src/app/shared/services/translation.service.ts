import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Url } from '../Constant/URL';

@Injectable({
  providedIn: 'root'
})
export class TranslationService implements TranslateLoader {
  public translations: any = null;
  constructor(private http: HttpClient) { }
  getTranslation(lang: string): any {
    return this.http.get(Url.constDefaultGetLanguage + '?lang=' + lang).
      pipe(
        map((data: any[]) => {
          console.log(data['data']);
          return data['data'];
        }), catchError(error => {
          return throwError('Something went wrong!');
        })
      );
  }
}

