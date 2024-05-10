import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private httpService: HttpService) {}

  getCart(postDate: any): Observable<any> {
    return this.httpService.get('car/all', postDate);
  }
}
