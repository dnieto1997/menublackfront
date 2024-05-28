import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-producto-groups',
  templateUrl: './producto-groups.component.html',
  styleUrls: ['./producto-groups.component.scss'],
})
export class ProductoGroupsComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public variant: any;
  public panelVisible: boolean = false;
  public name: string = '';
  public isEdit: boolean = false;
  public selectedVariantId: number | null = null;
  public selectedVariantIds: number[] = [];
  public availableVariants: {
    id: number;
    name: string;
    cost: string;
    status: boolean;
  }[] = [];
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
              this.auth.close();
            }
          });
        }
      }
    );

    this.auth.getVariant({}).subscribe(
      (res: any) => {
        this.variant = res;
        this.availableVariants = [...this.variant];
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
      this.data.product_variante = this.stringToArray(
        this.data.product_variante
      );
      this.selectedVariantIds = [...this.data.product_variante];
    } else {
      this.isEdit = false;
      this.data = { name: '', tipo: '', product_variante: [] };
      this.selectedVariantIds = [];
    }
    this.display = true;
  }

  stringToArray(variants: string): number[] {
    try {
      return JSON.parse(variants);
    } catch {
      return [];
    }
  }

  addVariant() {
    if (
      this.selectedVariantId !== null &&
      !this.selectedVariantIds.includes(this.selectedVariantId)
    ) {
      this.selectedVariantIds.push(this.selectedVariantId);
      this.removeFromAvailableVariants(this.selectedVariantId);
      this.selectedVariantId = null;
    }
  }

  removeVariant(index: number) {
    const removedId = this.selectedVariantIds.splice(index, 1)[0];
    this.addToAvailableVariants(removedId);
  }

  getVariantNameById(id: number): string {
    const variant = this.variant.find((v: { id: number }) => v.id === id);
    return variant ? variant.name : 'Unknown';
  }

  private removeFromAvailableVariants(id: number) {
    const index = this.availableVariants.findIndex((v) => v.id === id);
    if (index !== -1) {
      this.availableVariants.splice(index, 1);
    }
  }

  private addToAvailableVariants(id: number) {
    const variant = this.variant.find((v: { id: number }) => v.id === id);
    if (variant) {
      this.availableVariants.push(variant);
    }
  }

  createProduct() {
    this.display = true;

    if (!this.data.name || !this.data.tipo || !this.data.product_variante) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill all required fields',
        icon: 'warning',
      });
    } else {
      this.data.product_variante = this.selectedVariantIds;
      const datas = {
        name: this.data.name,
        producto_variante: this.data.product_variante,
        tipo: this.data.tipo,
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
              this.selectedVariantIds = [];
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
    if (!this.data.name || !this.data.tipo || !this.data.product_variante) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill all required fields',
        icon: 'warning',
      });
    } else {
      this.data.product_variante = this.selectedVariantIds;
      this.auth
        .updateProductVariantes(this.data.id, {
          name: this.data.name,
          producto_variante: this.data.product_variante,
          tipo: this.data.tipo,
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
              this.data = {};
              this.selectedVariantIds = [];
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  VariantId(lineId: any): string {
    // Verifica si lineId es un array. Si lo es, usa ese array directamente.
    let ids: number[];
    if (Array.isArray(lineId)) {
      ids = lineId;
    } else if (typeof lineId === 'string') {
      // Si lineId es un string, elimine los corchetes y conviértalo en un array.
      ids = lineId
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(Number);
    } else {
      // Si no es ni un array ni un string, devuelve un array vacío para evitar errores.
      ids = [];
    }

    // Mapear cada ID a su respectivo nombre de variante
    const variantNames = ids.map((id) => {
      const variant = this.variant?.find((v: { id: number }) => v.id === id);
      return variant ? variant.name : 'Grupo no encontrado';
    });

    // Devolver una cadena con los nombres de las variantes separados por coma
    return variantNames.join(', ');
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
              this.display = false;
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
