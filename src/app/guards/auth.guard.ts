import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthConfi } from '../config/authConfi';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
      this.storageService.get(AuthConfi.AUTH).then((res) => {
        this.authService.menu(0).subscribe((res: any) => {});
      });
    });
  }
}
