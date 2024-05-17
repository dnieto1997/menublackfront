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

    this.productService.getProduct({}).subscribe(
      (res: any) => {
        this.product = res;
      },
      (error: any) => {
        if (error.status == 401) {
          this.auth.close();
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
        }
      }
    );
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
    if (!this.data.product_id) {
      Swal.fire({
        title: 'Warning',
        text: 'Name no exist',
        icon: 'warning',
      });
    } else {
      this.loading = true;

      const datas = {
        producto_id: this.data.product_id,
        producto_variante: this.data.product_variante,
      };

      this.auth.createProductVariant(datas).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Creacion Exitosa',
              text: 'Fue creada el  producto Variante ' + res.message,
              icon: 'success',
            });
            this.data = {};
            this.start();
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
    console.log(item);

    setTimeout(() => {
      this.overlayPanel.toggle(event);
    }, 200);
  }
  edit() {
    if (!this.data.product_id) {
      Swal.fire({
        title: 'Warning',
        text: 'Prodcuto Id vacio',
        icon: 'warning',
      });
    } else {
      this.loading = true;
      console.log(this.data.product_id);
      console.log(this.data.product_variante);

      this.auth
        .updateProductVariantes(this.data.id, {
          producto_id: this.data.product_id,
          producto_variante: this.data.product_variante,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.display = false;

              this.loading = false;
              Swal.fire({
                title: 'Actualización Exitosa',
                text: 'Producto de Variante Actualizada Exitosamente ',
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
          if (error.status == 401) {
            this.auth.close();
          }
        }
      );
  }
}
