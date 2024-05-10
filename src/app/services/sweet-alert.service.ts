import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor() {}

  sweetAlert(title: string, text: string, confirmButtonText: string, icon: SweetAlertIcon = 'info') {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText
    });
  }
}
