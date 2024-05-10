import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpService: HttpService) { }

  getCategory(postDate: any): Observable<any> {
    return this.httpService.get(`category/table${postDate ? '?name=' + postDate : ''}`, postDate);
  }
  postCategory(postDate: any): Observable<any> {
    return this.httpService.post('category', postDate);
  }
  updateCategory(postDate: any, id: number): Observable<any> {
    return this.httpService.patch('category/' + id, postDate);
  }
}
