import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent {
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public display2: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public data2: any = {};
  public groups: { id: number; name: string }[] = [];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.findAll();
    this.findGroup();
  }

  findAll() {
    this.auth.findAllLine({}).subscribe(
      (res: any) => {
        this.list = res;
        this.loading = false;
        this.showTable = true;
        this.squeleto = false;
      },
      (error: any) => {
        this.loading = false;
        if (error.status == 401) {
          Swal.fire({
            title: 'Token Expirado',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Aceptar',
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

  findGroup() {
    this.auth.findAllGroup({}).subscribe(
      (res: any) => {
        this.groups = res;
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        }
      }
    );
  }

  openModal() {
    this.display = true;
  }

  getGroupNameById(groupId: number): string {
    const group = this.groups?.find((g: { id: number }) => g.id === groupId);
    return group ? group.name : 'Grupo no encontrado';
  }

  async createGroup() {
    if (
      !this.data.img ||
      !this.data.code ||
      !this.data.position ||
      !this.data.name ||
      !this.data.observations ||
      this.data.group == 0
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Please complete all fields.',
        icon: 'error',
      });
      return;
    } else {
      this.auth.createLine(this.data).subscribe(
        (res: any) => {
          if (res) {
            Swal.fire({
              title: 'Creacion Exitosa',
              text: res.message,
              icon: 'success',
            }).then(() => {
              this.findAll();
            });
            this.display = false;
            this.data = {};
          }
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
                this.auth.close();
              }
            });
          }
        }
      );
    }
  }

  validateNumberInput(event: any) {
    const input = event.target;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, ''); // Solo permite números
  }

  toggleUserStatus(id: any, status: any) {
    this.auth.updateLineStatus(id, { status }).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Status Changed',
          text:
            'User status Was Changed: ' + (status ? 'Desactivate' : 'Activate'),
          icon: 'success',
        });
        this.findAll();
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        }
      }
    );
  }

  verificarURLImagen(url: string): string {
    if (url.startsWith('https://')) {
      return url;
    } else {
      return '../../../assets/noimage.jpg';
    }
  }

  eliminar(cadena: string): string {
    return cadena.replace(/[\[\]"]/g, '');
  }

  openEditDialog(item: any) {
    this.display2 = true;
    this.auth.findline(item).subscribe(
      (res: any) => {
        this.data2 = res;
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        }
      }
    );
  }

  EditGroup(id: any) {
    if (typeof this.data2.days === 'string') {
      try {
        this.data2.days = JSON.parse(this.data2.days);
      } catch (error) {
        console.error('Error al convertir el string en array:', error);
      }
    }
    this.auth
      .updateLine(id, {
        img: this.data2.img,
        position: this.data2.position,
        code: this.data2.code,
        group: this.data2.group,
        name: this.data2.name,
        observations: this.data2.observation,
      })
      .subscribe(
        (res: any) => {
          if (res.status == 201) {
            Swal.fire({
              title: 'Success',
              text: res.message,
              icon: 'success',
            }).then(() => {
              this.findAll();

              this.display2 = false;
            });
          }
        },
        (error: any) => {
          if (error.status == 401) {
            this.auth.close();
          }
        }
      );
  }
  removePTags(text: string): string {
    return text.replace(/<\/?p>/g, '');
  }
}
