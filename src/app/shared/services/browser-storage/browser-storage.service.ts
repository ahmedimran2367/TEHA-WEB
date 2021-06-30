import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  constructor() {}
  storageSubject = new Subject<string>();

  watchStorage(): Observable<any> {
    return this.storageSubject.asObservable();
  }
  setSessionStorage(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      this.storageSubject.next('setSession');
    } catch (e) {
      console.error('Error saving data to SessionStorage', e);
    }
  }

  getSessionStorage(key: string): any {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from sessionStorage', e);
      return null;
    }
  }

  removeSessionStorage(key: string): void {
    try {
      sessionStorage.removeItem(key);
      this.storageSubject.next('removeSession');
    } catch (e) {
      console.error('Error removing data from sessionStorage', e);
    }
  }

  setlocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.storageSubject.next(key);
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  }

  getlocalStorage(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  removelocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
      this.storageSubject.next('removeLocal');
    } catch (e) {
      console.error('Error removing data from localStorage', e);
    }
  }
}
