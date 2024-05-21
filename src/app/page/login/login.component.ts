import { Component } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { AuthConfi } from 'src/app/config/authConfi';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public user: string = '';
  public pass: string = '';
  public isLoading = false;
  products: any = [{ imagen: 'fp' }, { imagen: 'fp' }];
  public passwordFieldType: string = 'password';

  responsiveOptions: any[] | undefined;
  constructor(
    private auth: AuthService,
    public storageService: StorageService,
    public router: Router,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  login() {
    this.isLoading = true;
    this.auth.login({ user: this.user, password: this.pass }).subscribe(
      (res: any) => {
        this.storageService.store(AuthConfi.AUTH, res.token);
        this.userProfileService.setProfile(res.data_user.name);
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      (error: any) => {
        const { message } = error.error;
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'warning',
        });

        this.isLoading = false;
      }
    );
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
