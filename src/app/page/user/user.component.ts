import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from './user.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public editMode: {
    field: string | null;
    id: number | null;
    newValue: any | null;
  } = { field: null, id: null, newValue: null };
  public isEdit: boolean = false;
  public panelVisible: boolean = false;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.userService.getUser({}).subscribe(
      (res: any) => {
        console.log(res);
        this.list = res;
        this.loading = false;
        this.showTable = true;
        this.squeleto = false;
      },
      (error: any) => {
        this.loading = false;
        if (error.status == 401) {
          Swal.fire({
            title: 'Expired Token',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Confirm',
          }).then((result) => {
            if (result.isConfirmed) {
              // Acción cuando se hace clic en el botón Aceptar
              this.auth.close();
            }
          });
        }
      }
    );
  }
  openModal(param?: boolean) {
    if (param) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }
  createCategory() {
    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'Empty Name Field',
        icon: 'warning',
      });
    } else {
      this.userService.postUser(this.data).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Successful Creation',
              text: 'The user was created' + this.data.name,
            }).then(() => {
              this.start(); // Asegúrate de actualizar la página después de la confirmación
            });
          }
          this.display = false;
        },
        (error: any) => {
          if (error.status == 401) {
            this.auth.close();
          }
        }
      );
    }
  }

  reset(id: any) {
    this.auth.updateUser2(id, { password: 'Abc123' }).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Success',
          text: 'Password changed: Abc123',
          icon: 'success',
        });
        this.start();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  toggleUserStatus(id: any, status: any) {
    this.auth.updateUser(id, { status }).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Status Changed',
          text:
            'User status Was Changed: ' +
            (status == true ? 'Desactivate' : 'Activate'),
        });
        this.start();
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        }
      }
    );
  }
  toggleEditing(field: string, userId: number, newValue: any) {
    const fieldName = field === 'name' ? 'name' : 'user';

    this.auth.updateUser2(userId, { [fieldName]: newValue }).subscribe(
      (res: any) => {
        this.start();
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        }
      }
    );
    if (this.editMode.field === field && this.editMode.id === userId) {
      this.editMode = { field: null, id: null, newValue: null };
    } else {
      this.editMode = { field, id: userId, newValue };
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.editMode = { field: null, id: null, newValue: null };
    }
  }

  showOverlayPanel(event: Event, item: any) {
    if (this.panelVisible) {
      this.overlayPanel.hide();
    }
    this.data = item;

    setTimeout(() => {
      this.overlayPanel.toggle(event);
    }, 200);
  }
}
