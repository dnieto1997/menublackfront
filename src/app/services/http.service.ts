import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage.service';
import { AuthConfi } from 'src/app/config/authConfi';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public appVersion: string = environment.appVersion;
  public token: string = '';
  public country: string = '';
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.storageService.get(AuthConfi.AUTH).then((res: any) => {
      this.token = res;
    });
    this.storageService.get('sc').then((res: any) => {
      this.country = res;
    });
  }

  get(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const options = { headers: headers, withCredeintials: false };
    const url = environment.appVersion + serviceName;

    return this.http.get(url, options);
  }

  post(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    const options = { headers: headers, withCredeintials: false };
    const url = environment.appVersion + serviceName;

    return this.http.post(url, data, options);
  }

  put(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.token,
    });
    const options = { headers: headers, withCredeintials: false };
    const url = environment.appVersion + serviceName;

    return this.http.put(url, data, options);
  }
  patch(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'x-token': this.token || '',
    });
    const options = { headers: headers, withCredeintials: false };
    const url = environment.appVersion + serviceName;

    return this.http.patch(url, data, options);
  }

  delete(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'x-token': this.token || '',
    });
    const options = { headers: headers, withCredeintials: false };
    const url = environment.appVersion + serviceName;

    return this.http.delete(url, options);
  }
}
