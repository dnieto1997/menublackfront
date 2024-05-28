import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { AuthConfi } from 'src/app/config/authConfi';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private router: Router,
    public storageService: StorageService
  ) {}

  login(postDate: any): Observable<any> {
    return this.httpService.post('auth', postDate);
  }

  verify(postDate: any): Observable<any> {
    return this.httpService.post('auth/verify', postDate);
  }

  updateUser(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`login/status/${postDate}`, postDate2);
  }

  updateUser2(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`login/${postDate}`, postDate2);
  }

  eliminar(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(`login/${postDate}`, postDate2);
  }

  createGroup(postDate: any): Observable<any> {
    return this.httpService.post(`group`, postDate);
  }

  findAllGroup(postDate: any): Observable<any> {
    return this.httpService.get(`group`, postDate);
  }

  findgroup(postDate: any): Observable<any> {
    return this.httpService.get(`group/${postDate}`, postDate);
  }

  updateGroupStatus(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`group/status/${postDate}`, postDate2);
  }

  updateGroup(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`group/${postDate}`, postDate2);
  }

  eliminarGroup(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(`group/${postDate}`, postDate2);
  }

  findAllLine(postDate: any): Observable<any> {
    return this.httpService.get(`lines`, postDate);
  }

  createLine(postDate: any): Observable<any> {
    return this.httpService.post(`lines`, postDate);
  }

  updateLineStatus(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`lines/status/${postDate}`, postDate2);
  }

  findline(postDate: any): Observable<any> {
    return this.httpService.get(`lines/${postDate}`, postDate);
  }

  updateLine(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`lines/${postDate}`, postDate2);
  }

  eliminarLine(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(`lines/${postDate}`, postDate2);
  }

  getVariant(postDate: any): Observable<any> {
    return this.httpService.get(`variantes`, postDate);
  }

  createVariant(postDate: any): Observable<any> {
    return this.httpService.post('variantes', postDate);
  }
  updateStatusVariantes(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`variantes/status/${postDate}`, postDate2);
  }

  updateVariantes(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`variantes/${postDate}`, postDate2);
  }

  eliminarVariantes(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(`variantes/${postDate}`, postDate2);
  }

  getProductVariant(postDate: any): Observable<any> {
    return this.httpService.get(`productos-variantes`, postDate);
  }

  createProductVariant(postDate: any): Observable<any> {
    return this.httpService.post('productos-variantes', postDate);
  }
  updateStatusProductVariantes(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(
      `productos-variantes/status/${postDate}`,
      postDate2
    );
  }

  updateProductVariantes(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.put(`productos-variantes/${postDate}`, postDate2);
  }

  eliminarProductVariantes(postDate: any, postDate2: any): Observable<any> {
    return this.httpService.delete(
      `productos-variantes/${postDate}`,
      postDate2
    );
  }

  menu(postDate: any): Observable<any> {
    return this.httpService.get(`menu`, postDate);
  }

  close() {
    this.storageService.removeItem(AuthConfi.AUTH);
    this.storageService.removeItem('profile');
    this.router.navigate(['login']);
  }
}
