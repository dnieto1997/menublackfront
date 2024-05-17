import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private httpService: HttpService) {}

  getUser(postDate: any): Observable<any> {
    return this.httpService.get('client', postDate);
  }

  createClient(postDate: any): Observable<any> {
    return this.httpService.post('client', postDate);
  }
  updateStatusClient(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`client/status/${postDate}`, postDate2);
  }

  updateClient(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`client/${postDate}`, postDate2);
  }
}
