import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoryService } from '../category/category.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-variantes',
  templateUrl: './variantes.component.html',
  styleUrls: ['./variantes.component.scss'],
})
export class VariantesComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public line: any;
  public group: any;
  public panelVisible: boolean = false;
  public name: string = '';
  public isEdit: boolean = false;
  public fileSelect?: string | ArrayBuffer | null = null;
  public text: string | undefined =
    '<p>Aquí tu contenido inicial para el editor.</p>';
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.auth.getVariant({}).subscribe(
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
            text: 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.',
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
  openModal(param?: boolean) {
    if (param) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
      this.data = {};
    }
    this.display = true;
  }

  createProduct() {
    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'Name no exist',
        icon: 'warning',
      });
    } else {
      this.loading = true;

      const datas = {
        name: this.data.name,
        cost: this.data.cost,
      };

      this.auth.createVariant(datas).subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            Swal.fire({
              title: 'Creacion Exitosa',
              text: 'Fue creada la Variante ' + this.data.name,
              icon: 'success',
            }).then(() => {
              this.start();
              this.display = false;
              // Asegúrate de actualizar la página después de la confirmación
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
  }
  validateNumberInput(event: any) {
    const input = event.target;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, ''); // Solo permite números
  }
  showOverlayPanel(event: Event, item: any) {
    if (this.panelVisible) {
      this.overlayPanel.hide();
    }
    this.data = item;

    this.fileSelect = item.img1;

    setTimeout(() => {
      this.overlayPanel.toggle(event);
    }, 200);
  }
  edit() {
    this.loading = true;
    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'campo nombre de categoria vacio',
        icon: 'warning',
      });
    } else {
      this.auth
        .updateVariantes(this.data.id, {
          name: this.data.name,
          cost: this.data.cost,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.loading = false;
              Swal.fire({
                title: 'Actualización Exitosa',
                text: 'Variante Actualizada Exitosamente ',
                icon: 'success',
              }).then(() => {
                this.start();
                this.display = false;

                // Asegúrate de actualizar la página después de la confirmación
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
  }

  changeStatus() {
    this.loading = true;

    this.auth
      .updateStatusVariantes(this.data.id, { status: this.data.status })
      .subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;

            Swal.fire({
              title: 'Cambio de Estado Exitoso',
              text: 'Variante Actualizada Exitosamente ',
              icon: 'success',
            }).then(() => {
              this.start();
              this.display = false; // Asegúrate de actualizar la página después de la confirmación
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  eliminarVariant() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Variant?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.eliminarVariantes(this.data.id, {}).subscribe(
          (res: any) => {
            Swal.fire({
              title: 'Success',
              text: res.message,
              icon: 'success',
            });
            this.start();
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    });
  }
}
