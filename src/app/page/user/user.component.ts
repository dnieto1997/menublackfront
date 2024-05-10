import { Component, ElementRef, HostListener } from '@angular/core';
import { UserService } from './user.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
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

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.userService.getUser({}).subscribe((res: any) => {
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }
  openModal() {
    this.display = true;
  }
  createCategory() {
    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'campo nombre  vacio',
        icon: 'warning',
      });
    } else {
      this.userService.postUser(this.data).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Creacion Exitosa',
              text: 'Fue creado el usuario ' + this.data.name,
            });
            this.start();
          }
          this.display = false;
        },
        (error: any) => {
          console.log(error.error.statusText);
          if (error.statusText == 'Unauthorized') {
            this.auth.close();
          }

          console.log(error);
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
        console.log(error);
      }
    );
  }
  toggleEditing(field: string, userId: number, newValue: any) {
    const fieldName = field === 'name' ? 'name' : 'user';

    this.auth.updateUser2(userId, { [fieldName]: newValue }).subscribe(
      (res: any) => {
        console.log(res);
        this.start();
      },
      (error: any) => {
        console.log(error);
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
}
