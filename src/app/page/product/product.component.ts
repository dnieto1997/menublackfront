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
  public group: any;
  public panelVisible: boolean = false;
  public name: string = '';
  public isEdit: boolean = false;
  public fileSelect?: string | ArrayBuffer | null = null;
  public text: string | undefined =
    '<p>Aquí tu contenido inicial para el editor.</p>';

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
  createProduct() {
    if (this.data.img.length >= 255) {
      Swal.fire({
        title: 'Warning',
        text: 'Image field is very large',
        icon: 'warning',
      });
    } else {
      this.loading = true;
      const formData = new FormData();

      const datas = {
        img: this.data.img,
        code: this.data.code,
        group: this.data.group,
        line: this.data.line,
        name: this.data.name,
        price: this.data.price,
        stars: this.data.stars,
        new: this.data.new,
        promotion: this.data.promotion,
        observations: this.data.observations,
      };

      this.productService.postProduct(datas).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            Swal.fire({
              title: 'Successful Creation',
              text: 'The category was created ' + this.data.name,
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
    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'Empty category name field',
        icon: 'warning',
      });
    } else {
      this.loading = true;

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
          observations: this.data.observation,
        })
        .subscribe(
          (res: any) => {
            if (res) {
              this.display = false;
              this.loading = false;
              Swal.fire({
                title: 'Successful Update',
                text: 'Product Updated Successfully',
                icon: 'success',
              }).then(() => {
                this.start(); // Asegúrate de actualizar la página después de la confirmación
              });
            }
          },
          (error: any) => {
            this.loading = false;
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
}
