import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  constructor(private httpService: HttpService) {}

  Banner(): Observable<any> {
    return this.httpService.get(`banner`, {});
  }

  createBanner(postDate: any): Observable<any> {
    return this.httpService.post('banner', postDate);
  }
  updateStatusBanner(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`banner/status/${postDate}`, postDate2);
  }

  updateBanner(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`banner/${postDate}`, postDate2);
  }
  eliminar(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(`banner/${postDate}`, postDate2);
  }
}
