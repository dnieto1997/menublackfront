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
    this.auth.getVariant({}).subscribe((res: any) => {
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
            this.display = false;
            Swal.fire({
              title: 'Creacion Exitosa',
              text: 'Fue creada la Variante ' + this.data.name,
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
    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'campo nombre de categoria vacio',
        icon: 'warning',
      });
    } else {
      this.loading = true;

      this.auth
        .updateVariantes(this.data.id, {
          name: this.data.name,
          cost: this.data.cost,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.display = false;
              this.start();
              this.loading = false;
              Swal.fire({
                title: 'Actualización Exitosa',
                text: 'Variante Actualizada Exitosamente ',
                icon: 'success',
              });
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
    console.log(this.data.id);
    console.log(this.data.status);

    this.auth
      .updateStatusVariantes(this.data.id, { status: this.data.status })
      .subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            this.display = false;
            this.start();
            Swal.fire({
              title: 'Cambio de Estado Exitoso',
              text: 'Variante Actualizada Exitosamente ',
              icon: 'success',
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
}
