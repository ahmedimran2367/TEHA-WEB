import { Injectable } from '@angular/core';
import { SettingRequest } from '../models/setting-request-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Url } from '../../../shared/Constant/URL';
import { SystemSettings } from '../models/system-settings-model';
import { UserSetting } from '../models/user-setting-model';
@Injectable({
  providedIn: 'root',
})
export class SystemSettingsService {
  body: SettingRequest;
  result: any;
  constructor(private httpClient: HttpClient) {
    this.body = {
      pageNo: 0,
      pageSize: 10,
      sort: {
        by: 'displayName',
        direction: 'asc',
      },
    };
  }
  Get(pageNo: number, pageSize: number, sortBy: string, sortDirection: string): Observable<any> {
    this.body.pageNo = pageNo;
    this.body.pageSize = pageSize;
    this.body.sort.by = sortBy;
    this.body.sort.direction = sortDirection;
    return this.httpClient.post<any>(Url.constSystemSettingsGet, this.body);
  }
  Update(settings: SystemSettings): any {
    return this.httpClient.put(Url.constUpdateSettings, settings);
  }
  GetUserSetting(id: number): Observable<any> {
    return this.httpClient.get<any>(Url.constUserSettingGet + '?id=' + id);
  }
  GetDocumentJson(): Observable<any> {
    return this.httpClient.get<any>(Url.constSystemSettingGetDocumentJson);
  }
  CreateOrUpdateUserSetting(model: UserSetting): Observable<any> {
    return this.httpClient.post(Url.constCreateOrUpdateUserSetting, model);
  }
}
