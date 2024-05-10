import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private httpService: HttpService) {}

  getUser(postDate: any): Observable<any> {
    return this.httpService.get('user', postDate);
  }
}
