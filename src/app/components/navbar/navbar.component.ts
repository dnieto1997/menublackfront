import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslationService } from 'src/app/services/translation.service';
import { UserProfileService } from 'src/app/services/user-profile.service'; // Import the service
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  public showNavbar: boolean = true;
  public showProfileOptions: boolean = false;
  public isMenuOpen: boolean = false;
  public isSubmenuOpen: boolean[] = [false, false, false];
  public menuOptions: any[] = [];
  public countries: any[] | undefined;
  public name: string | null = '';
  private profileSubscription: Subscription | undefined;
  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    public authService: AuthService,
    public storageService: StorageService,
    private userProfileService: UserProfileService // Inject the service
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = this.router.url !== '/login';
      }
    });
  }

  ngOnInit() {
    this.countries = [
      { name: 'Spain', code: 'es', img: '' },
      { name: 'United States', code: 'en' },
    ];
    this.menu();
    this.obtenerNombre();

    // Subscribe to the profile updates
    this.profileSubscription = this.userProfileService.currentProfile.subscribe(
      (profile) => {
        this.name = profile;
      }
    );
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
    setTimeout(() => {
      this.showProfileOptions = false;
    }, 50000);
  }

  menu() {
    this.authService.menu({}).subscribe(
      (res: any) => {
        this.menuOptions = res;
      },
      (error: any) => {
        if (error.status == 401) {
          Swal.fire({
            title: 'Expired Token',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.authService.close();
            }
          });
        }
      }
    );
  }

  logout() {
    this.authService.close();
    this.userProfileService.clearProfile(); // Clear profile on logout
  }

  obtenerNombre() {
    // Initially set the profile name from the service
    const profile = this.userProfileService.getInitialProfile();
    if (profile) {
      this.name = profile;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubmenu(index: number) {
    this.isSubmenuOpen[index] = !this.isSubmenuOpen[index];
  }

  isOptionActive(option: any): boolean {
    if (option.isSubmenu) {
      return option.subOptions.some((subOption: any) =>
        this.router.url.includes(subOption)
      );
    } else {
      return this.router.url.includes(option.url);
    }
  }

  changeLanguage(language: string) {
    this.translationService.setLanguage(language);
  }
}
