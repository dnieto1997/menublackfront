import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpService: HttpService) { }

  getOrders(postDate: any): Observable<any> {
    const { namcli, idorder, status } = postDate
    return this.httpService.get(`shopping/all${namcli || idorder || status ? '?' : ''}${namcli ? 'namecli=' + namcli : ''}${idorder ? '&idorder=' + idorder : ''}${status ? 'status=' + status : ''}`, postDate);
  }
  updateOrder(postDate: any, id: number): Observable<any> {
    return this.httpService.patch('shopping/' + id, postDate);
  }
}
