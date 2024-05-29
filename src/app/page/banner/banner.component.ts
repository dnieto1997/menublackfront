import { Component, ViewChild } from '@angular/core';
import { BannerService } from './banner.service';
import Swal from 'sweetalert2';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public panelVisible: boolean = false;
  public name: string = '';
  public line: any;
  public isEdit: boolean = false;
  public text: string | undefined =
    '<p>Aquí tu contenido inicial para el editor.</p>';

  constructor(
    private auth: AuthService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.bannerService.Banner().subscribe(
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
        } else if (error.status == 409) {
          Swal.fire({
            title: 'Warning',
            text: error.error.message,
            icon: 'error',
          });
        }
      }
    );

    this.auth.findAllLine({}).subscribe(
      (res: any) => {
        this.line = res;
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
        } else if (error.status == 409) {
          Swal.fire({
            title: 'Warning',
            text: error.error.message,
            icon: 'error',
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

  createBanner() {
    if (!this.data.lines) {
      Swal.fire({
        title: 'Warning',
        text: 'Line no exist',
        icon: 'warning',
      });
    } else {
      this.loading = true;

      const datas = {
        img: this.data.img,
        line: this.data.lines,
      };

      this.bannerService.createBanner(datas).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Successful Creation',
              text: 'The Variant product was created: ' + res.message,
              icon: 'success',
            }).then(() => {
              this.start(); // Asegúrate de actualizar la página después de la confirmación
            });
          }
          this.data = {};
          this.loading = false;
        },
        (error: any) => {
          if (error.status == 401) {
            Swal.fire({
              title: 'Expired Token',
              text: 'Your session has expired. Please log in again.',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Accept',
            }).then((result) => {
              if (result.isConfirmed) {
                // Acción cuando se hace clic en el botón Aceptar
                this.auth.close();
              }
            });
          } else if (error.status == 409) {
            Swal.fire({
              title: 'Warning',
              text: error.error.message,
              icon: 'error',
            });
          }
        }
      );
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
  edit() {
    if (!this.data.lines) {
      Swal.fire({
        title: 'Warning',
        text: 'Empty Producto Id ',
        icon: 'warning',
      });
    } else {
      this.loading = true;

      this.bannerService
        .updateBanner(this.data.id, {
          img: this.data.img,
          line: this.data.lines,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.display = false;

              this.loading = false;
              Swal.fire({
                title: 'Successful Update',
                text: 'Banner Updated Successfully',
                icon: 'success',
              });

              this.start();
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  changeStatus() {
    this.loading = true;

    this.bannerService
      .updateStatusBanner(this.data.id, { status: this.data.status })
      .subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            this.display = false;
            this.start();
            Swal.fire({
              title: 'Successful State Change',
              text: 'Status changed',
              icon: 'success',
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
  linesByuid(lineId: number): string {
    const line: any = this.line?.find((g: { id: number }) => g.id === lineId);
    return line ? line.name : 'Grupo no encontrado';
  }

  verificarURLImagen(url: string): string {
    if (url.startsWith('https://')) {
      return url; // Si la URL comienza con "https://", es válida
    } else {
      return '../../../assets/noimage.jpg'; // Si la URL no es válida, devuelve la ruta de la imagen "No imagen"
    }
  }

  eliminarBanner() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Product Group?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bannerService.eliminar(this.data.id, {}).subscribe(
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
