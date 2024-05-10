import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}

  getUser(postDate: any): Observable<any> {
    return this.httpService.get('login', postDate);
  }
  postUser(postDate: any): Observable<any> {
    return this.httpService.post('login', postDate);
  }
}
