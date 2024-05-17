import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Socket, io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { TranslationService } from 'src/app/services/translation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public showNavbar: boolean = true;
  public showProfileOptions: boolean = false;
  public isMenuOpen: boolean = false;
  public isSubmenuOpen: boolean[] = [false, false, false];
  public menuOptions: any[] = [];
  public countries: any[] | undefined;
  public name: any;
  public selectedCountry: any;

  voices: SpeechSynthesisVoice[] = [];
  constructor(
    private router: Router,
    private translationService: TranslationService,
    public authService: AuthService,
    public storageService: StorageService
  ) {
    this.router.events.subscribe((event) => {
      if (this.router.url === '/login') {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
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
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
    setTimeout(() => {
      this.showProfileOptions = !this.showProfileOptions;
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
              // Acción cuando se hace clic en el botón Aceptar
              this.authService.close();
            }
          });
        }
      }
    );
  }
  logout() {
    this.authService.close();
  }

  obtenerNombre() {
    // Obtener el valor de 'profile' del localStorage
    let profile = localStorage.getItem('profile');

    // Verificar si el valor existe y si es una cadena
    if (profile && typeof profile === 'string') {
      // Eliminar las comillas alrededor del valor, si están presentes
      if (profile.startsWith('"') && profile.endsWith('"')) {
        profile = profile.substring(1, profile.length - 1);
      }
    }

    // Asignar el valor al nombre
    this.name = profile;
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
      return this.router.url.includes(option.url); // Utiliza la propiedad "url" en lugar de "name"
    }
  }
  changeLanguage(language: string) {
    this.translationService.setLanguage(language);
  }
}
