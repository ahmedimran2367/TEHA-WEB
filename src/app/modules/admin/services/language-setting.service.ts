import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageSetting } from '../models/language-setting-model';
import { Url } from '../../../shared/Constant/URL';
import { LanguageRequest } from '../models/language-request-model';
import { Response } from 'src/app/shared/models/Response';

@Injectable({
  providedIn: 'root',
})
export class LanguageSettingService {
  body: LanguageRequest;
  result: any;
  constructor(private httpClient: HttpClient) {
    this.body = {
      category: '',
      freeSearch: '',
      pageNo: 0,
      pageSize: 10,
      sort: {
        by: 'code',
        direction: 'asc',
      },
    };
  }
  Get(category: string, freeSearch: string, pageNo: number, pageSize: number, sortBy: string, sortDirection: string): Observable<any> {
    this.body.category = category;
    this.body.freeSearch = freeSearch;
    this.body.pageNo = pageNo;
    this.body.pageSize = pageSize;
    this.body.sort.by = sortBy;
    this.body.sort.direction = sortDirection;
    return this.httpClient.post<any>(Url.constLanguageGet, this.body);
  }
  Update(language: LanguageSetting): Observable<Response> {
    return this.httpClient.put<any>(Url.constUpdateLanguage, language);
  }
  GetSystemSettings(pageNo: number, pageSize: number, sortBy: string, sortDirection: string): Observable<any> {
    this.body.pageNo = pageNo;
    this.body.pageSize = pageSize;
    this.body.sort.by = sortBy;
    this.body.sort.direction = sortDirection;
    return this.httpClient.post<any>(Url.constSystemSettingsGet, this.body);
  }
}
