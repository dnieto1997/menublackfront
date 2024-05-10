import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthConfi } from '../config/authConfi';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private auth: AuthService
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
      this.storageService
        .get(AuthConfi.AUTH)
        .then((res) => {
          if (res) {
            this.router.navigate(['dashboard']);
            resolve(false);
          } else {
            this.router.navigate(['login']);
            resolve(true);
          }
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }
}
