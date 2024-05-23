import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-producto-variantes',
  templateUrl: './producto-variantes.component.html',
  styleUrls: ['./producto-variantes.component.scss'],
})
export class ProductoVariantesComponent {
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
    private auth: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.auth.getProductVariant({}).subscribe(
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
        }
      }
    );

    this.productService.getProduct({}).subscribe(
      (res: any) => {
        this.product = res;
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
    this.auth.getVariant({}).subscribe(
      (res: any) => {
        this.variant = res;
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

  createProduct() {
    this.display = true;
    if (!this.data.product_id) {
      Swal.fire({
        title: 'Warning',
        text: 'Name no exist',
        icon: 'warning',
      });
    } else {
      const datas = {
        producto_id: this.data.product_id,
        producto_variante: this.data.product_variante,
      };

      this.auth.createProductVariant(datas).subscribe(
        (res: any) => {
          if (res) {
            Swal.fire({
              title: 'Successful Creation',
              text: res.message,
              icon: 'success',
            }).then(() => {
              this.start();
            });

            this.display = false;
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
    this.display = true;
    if (!this.data.product_id) {
      Swal.fire({
        title: 'Warning',
        text: 'Empty Producto Id ',
        icon: 'warning',
      });
    } else {
      this.auth
        .updateProductVariantes(this.data.id, {
          producto_id: this.data.product_id,
          producto_variante: this.data.product_variante,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.loading = false;
              Swal.fire({
                title: 'Successful Update',
                text: 'Variant Product Updated Successfully',
                icon: 'success',
              }).then(() => {
                this.start();
              });

              this.display = false;
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  productId(groupId: number): string {
    const product = this.product?.find((g: { id: number }) => g.id == groupId);
    return product ? product.name : 'Grupo no encontrado';
  }

  VariantId(lineId: number): string {
    const variant = this.variant?.find((g: { id: number }) => g.id == lineId);
    return variant ? variant.name : 'Grupo no encontrado';
  }

  changeStatus() {
    this.loading = true;

    this.auth
      .updateStatusProductVariantes(this.data.id, { status: this.data.status })
      .subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            Swal.fire({
              title: 'Successful State Change',
              text: 'Status changed',
              icon: 'success',
            }).then(() => {
              this.start();

              this.display = false; // Asegúrate de actualizar la página después de la confirmación
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
