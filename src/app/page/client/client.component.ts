import { Component, ViewChild } from '@angular/core';
import { ClientService } from './client.service';
import Swal from 'sweetalert2';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public variant: any;
  public product: any;
  public panelVisible: boolean = false;
  public name: string = '';
  public isEdit: boolean = false;
  public fileSelect?: string | ArrayBuffer | null = null;
  public text: string | undefined =
    '<p>Aquí tu contenido inicial para el editor.</p>';

  constructor(
    private clientService: ClientService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.clientService.getUser({}).subscribe((res: any) => {
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }

  openModal(param?: boolean) {
    if (param) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
      console.log(this.data);
      this.data = {};
    }
    this.display = true;
  }

  createProduct() {
    if (!this.data.nombres) {
      Swal.fire({
        title: 'Warning',
        text: 'Name no exist',
        icon: 'warning',
      });
    } else {
      const datas = {
        nombres: this.data.nombres,
        apellidos: this.data.apellidos,
        celular: this.data.celular,
        direccion: this.data.direccion,
        barrio: this.data.barrio,
        medioDePago: this.data.medioDePago,
        observaciones: this.data.observaciones, // This field is optional
      };

      this.clientService.createClient(datas).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Successful Creation',
              text: 'The Variant product was created' + res.message,
              icon: 'success',
            }).then(() => {
              this.start();
              this.loading = false; // Asegúrate de actualizar la página después de la confirmación
            });
            this.data = {};
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
    if (!this.data.nombres) {
      Swal.fire({
        title: 'Warning',
        text: 'Nombre Vacio ',
        icon: 'warning',
      });
    } else {
      this.loading = true;

      this.clientService
        .updateClient(this.data.id, {
          nombres: this.data.nombres,
          apellidos: this.data.apellidos,
          celular: this.data.celular,
          direccion: this.data.direccion,
          barrio: this.data.barrio,
          medioDePago: this.data.medioDePago,
          observaciones: this.data.observaciones,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.display = false;

              this.loading = false;
              Swal.fire({
                title: 'Successful Update',
                text: 'Client Actualizado',
                icon: 'success',
              }).then(() => {
                this.start(); // Asegúrate de actualizar la página después de la confirmación
              });
            }
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
            }
          }
        );
    }
  }

  changeStatus() {
    this.loading = true;

    this.clientService
      .updateStatusClient(this.data.id, { status: this.data.status })
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

  removePTags(text: string): string {
    return text.replace(/<\/?p>/g, '');
  }
  validateNumberInput(event: any) {
    const input = event.target;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, ''); // Solo permite números
  }
}
