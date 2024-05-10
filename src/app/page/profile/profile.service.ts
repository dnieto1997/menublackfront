import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpService: HttpService) {}

  getProfile(postDate: any): Observable<any> {
    return this.httpService.get('aliado/find/', postDate);
  }
}
