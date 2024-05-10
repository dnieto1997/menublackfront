import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpService: HttpService) { }

  getProduct(postDate: any): Observable<any> {
    return this.httpService.get(`products/table${postDate ? '?name=' + postDate : ''}`, postDate);
  }
  postProduct(postDate: any): Observable<any> {
    return this.httpService.post('products', postDate);
  }
  updateProduct(data: any, id: any): Observable<any> {
    return this.httpService.patch(`products/${id}`, data)
  }
}
