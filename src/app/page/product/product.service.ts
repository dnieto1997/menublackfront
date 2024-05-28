import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpService: HttpService) {}

  getProduct(postDate: any): Observable<any> {
    return this.httpService.get(`products`, postDate);
  }
  updateStatus(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`products/status/${postDate}`, postDate2);
  }

  findline(postDate: any): Observable<any> {
    return this.httpService.get(`products/${postDate}`, postDate);
  }

  updateLine(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`products/${postDate}`, postDate2);
  }

  postProduct(postDate: any): Observable<any> {
    return this.httpService.post('products', postDate);
  }
  updateProduct(id: any, data: any): Observable<any> {
    return this.httpService.patch(`products/${id}`, data);
  }

  eliminarProduct(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(`products/${postDate}`, postDate2);
  }
}
