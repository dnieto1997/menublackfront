import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  constructor(private httpService: HttpService) {}

  getFiles(): Observable<any> {
    return this.httpService.get(`sliders`, {});
  }
  updateFile(formData: FormData): Observable<any> {
    return this.httpService.post(`sliders`, formData);
  }
  delete(data: any): Observable<any> {
    return this.httpService.delete(`sliders/${data}`, {});
  }
}
