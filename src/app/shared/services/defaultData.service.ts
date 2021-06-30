import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DefaultData } from '../models/DefaultData';
import { Url } from '../Constant/URL';
import { Response } from '../models/Response';
import { Resolve } from '@angular/router';
import { tap } from 'rxjs/operators';

export class DefaultDataServiceConfig {
    userName = '';
}

@Injectable({
    providedIn : 'root'
})
export class DefaultDataService implements Resolve<Observable<any>>  {

    public DefaultData: DefaultData;
   // public currentUserLanguage:string = null;
   // public currentUserGridSize = null;
    public systemGridSize = null;
    resolve(): any {
        return this.GetDefaultData();
    }

    constructor(@Optional() config: DefaultDataServiceConfig, private http: HttpClient) {
    }

    GetDefaultData(): Observable<Response> {
        return this.http.get<Response>(Url.constDefaultDataGet).pipe(
            tap(data => {
                const count =  localStorage.getItem('currentUserGridSize');
                this.systemGridSize = data.data['systemSettings']['gridPageSize'];
                if (parseInt(count, 10)  > 0)
                {
                    data.data['systemSettings']['gridPageSize'] = localStorage.getItem('currentUserGridSize');
                }
                this.DefaultData = data.data;
            })
        );
    }
}
