import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductService } from './product.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public line: any;
  public variant_group: any;
  public group: any;
  public panelVisible: boolean = false;
  public name: string = '';
  public isEdit: boolean = false;
  public fileSelect?: string | ArrayBuffer | null = null;
  public text: string | undefined =
    '<p>Aquí tu contenido inicial para el editor.</p>';
  public selectedVariantId: number | null = null;
  public selectedVariantIds: number[] = [];
  public availableVariants: any; // Array para almacenar los IDs seleccionados

  constructor(
    private productService: ProductService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.start();
  }

  async start() {
    this.productService.getProduct({}).subscribe(
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

    this.auth.findAllGroup({}).subscribe(
      (res: any) => {
        this.group = res;
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

    this.auth.getProductVariant({}).subscribe(
      (res: any) => {
        this.variant_group = res;
        this.availableVariants = [...this.variant_group];
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
  }

  openModal(param?: boolean) {
    if (param) {
      this.isEdit = true;
      // Verifica si this.data.variantes_group no está vacío
      if (this.data.variantes_group && this.data.variantes_group.length > 0) {
        // Convierte this.data.variantes_group a array si no lo es ya
        this.data.variantes_group = this.stringToArray(
          this.data.variantes_group
        );
        // Asigna los valores de this.data.variantes_group a this.selectedVariantIds
        this.selectedVariantIds = [...this.data.variantes_group];
      } else {
        // Si this.data.variantes_group está vacío, no envíes nada
        // Podrías querer asignar this.selectedVariantIds a un valor predeterminado o vacío aquí
        this.selectedVariantIds = []; // O cualquier otro valor predeterminado que prefieras
      }
    } else {
      this.isEdit = false;
      this.data = {};
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
    const variant = this.variant_group.find((v: { id: number }) => v.id === id);
    return variant ? variant.name : 'Unknown';
  }

  private removeFromAvailableVariants(id: number) {
    const index = this.availableVariants.findIndex(
      (v: { id: number }) => v.id === id
    );
    if (index !== -1) {
      this.availableVariants.splice(index, 1);
    }
  }

  private addToAvailableVariants(id: number) {
    const variant = this.variant_group.find((v: { id: number }) => v.id === id);
    if (variant) {
      this.availableVariants.push(variant);
      console.log(this.availableVariants);
    }
  }

  groupsbyuid(groupId: number): string {
    const group = this.group?.find((g: { id: number }) => g.id === groupId);
    return group ? group.name : 'Grupo no encontrado';
  }

  linesByuid(lineId: number): string {
    const group: any = this.line?.find((g: { id: number }) => g.id === lineId);
    return group ? group.name : 'Grupo no encontrado';
  }

  verificarURLImagen(url: string): string {
    if (url.startsWith('https://')) {
      return url; // Si la URL comienza con "https://", es válida
    } else {
      return '../../../assets/noimage.jpg'; // Si la URL no es válida, devuelve la ruta de la imagen "No imagen"
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
      const variant = this.variant_group?.find(
        (v: { id: number }) => v.id === id
      );
      return variant ? variant.name : '';
    });

    // Devolver una cadena con los nombres de las variantes separados por coma
    return variantNames.join(', ');
  }

  createProduct() {
    this.loading = false;
    if (
      !this.data.name ||
      !this.data.code ||
      !this.data.group ||
      !this.data.lines ||
      !this.data.img ||
      !this.data.price ||
      !this.data.stars
    ) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill all required fields',
        icon: 'warning',
      });
    } else {
      this.data.variantes_group = this.selectedVariantIds;
      const datas = {
        img: this.data.img,
        code: this.data.code,
        group: this.data.group,
        line: this.data.lines,
        name: this.data.name,
        price: this.data.price,
        stars: this.data.stars,
        new: this.data.new,
        promotion: this.data.promotion,
        variantes_group: this.data.variantes_group,
        observations: this.data.observation ? this.data.observation : ' ',
      };

      this.productService.postProduct(datas).subscribe(
        (res: any) => {
          this.loading = false;
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Successful Creation',
              text: `The Product ${this.data.name} was created`,
              icon: 'success',
            }).then(() => {
              this.start();
            });
          }
        },
        (error: any) => {
          if (error.status == 401) {
            this.auth.close();
            this.loading = false;
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

  removePTags(text: string): string {
    if (!text) {
      return text; // Return the input text unchanged if it's falsy (empty or undefined)
    }
    return text.replace(/<\/?p>/g, ''); // Replace <p> and </p> tags with an empty string
  }

  validateNumberInput(event: any) {
    const input = event.target;
    let value = input.value;
    // Reemplaza todo lo que no sea dígito o punto decimal por una cadena vacía
    value = value.replace(/[^0-9.]/g, '');
    // Reemplaza los múltiples puntos decimales por uno solo
    value = value.replace(/(\..*)\./g, '$1');
    // Actualiza el valor del input
    input.value = value;
  }

  edit() {
    if (
      !this.data.name ||
      !this.data.code ||
      !this.data.group ||
      !this.data.lines ||
      !this.data.img ||
      !this.data.price ||
      !this.data.stars ||
      this.data.img.length >= 255
    ) {
      Swal.fire({
        title: 'Warning',
        text: 'Seleccione todos los campos',
        icon: 'warning',
      });
    } else {
      this.loading = true;
      this.data.variantes_group = this.selectedVariantIds;

      this.productService
        .updateProduct(this.data.id, {
          img: this.data.img,
          code: this.data.code,
          group: this.data.group,
          line: this.data.lines,
          name: this.data.name,
          price: this.data.price,
          stars: this.data.stars,
          new: this.data.new,
          promotion: this.data.promotion,
          variantes_group: this.data.variantes_group,
          observations: this.data.observation ? this.data.observation : ' ',
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.loading = false;
              Swal.fire({
                title: 'Successful Update',
                text: 'Product Updated Successfully',
                icon: 'success',
              }).then(() => {
                this.start();
                this.display = false; // Asegúrate de actualizar la página después de la confirmación
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
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.isConfirmed) {
                  // Acción cuando se hace clic en el botón Aceptar
                  this.auth.close();
                  this.loading = false;
                }
              });
            }
          }
        );
    }
  }

  obtenerImagenEstrellasConDiseno(
    numeroEstrellas: number
  ): { src: string; alt: string }[] {
    const numeroEntero = Math.min(Math.floor(numeroEstrellas), 5); // Limita el número de estrellas a 5 como máximo
    const decimal = numeroEstrellas - numeroEntero;
    const estrellas: { src: string; alt: string }[] = [];

    // Agregar estrellas llenas
    for (let i = 0; i < numeroEntero; i++) {
      estrellas.push({
        src: '../../../assets/llena.png',
        alt: 'Estrella llena',
      });
    }

    // Agregar estrella parcial si hay decimal
    if (decimal > 0) {
      estrellas.push({
        src: '../../../assets/media.png',
        alt: 'Estrella media',
      });
    }

    // Agregar estrellas vacías si es necesario
    const estrellasRestantes = 5 - estrellas.length;
    for (let i = 0; i < estrellasRestantes; i++) {
      estrellas.push({
        src: '../../../assets/vacia.png',
        alt: 'Estrella vacía',
      });
    }

    return estrellas;
  }

  changeStatus() {
    this.loading = true;

    this.productService
      .updateStatus(this.data.id, { status: this.data.status })
      .subscribe(
        (res: any) => {
          if (res) {
            this.loading = false;
            this.display = false;
            this.start();
            Swal.fire({
              title: 'Successful State Change',
              text: 'Category Updated Successfully',
              icon: 'success',
            }).then(() => {
              this.start(); // Asegúrate de actualizar la página después de la confirmación
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

  eliminarProduct() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.eliminarProduct(this.data.id, {}).subscribe(
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
