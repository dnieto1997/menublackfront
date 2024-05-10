import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { OverlayPanel } from 'primeng/overlaypanel';

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
  public categorys: any;
  public category: any;
  public panelVisible: boolean = false;
  public name: string = ''
  public isEdit: boolean = false;
  public fileSelect?: string | ArrayBuffer | null = null;
  public text: string | undefined = '<p>Aquí tu contenido inicial para el editor.</p>';
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.productService.getProduct('').subscribe((res: any) => {
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
    this.categoryService.getCategory('').subscribe((res: any) => {
      this.categorys = res;
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
    this.data.category = this.category.id;

    if (!this.data.name) {
      Swal.fire({
        title: 'Warning',
        text: 'campo nombre de categoria vacio',
        icon: 'warning',
      });
    } else {
      this.loading = true
      const formData = new FormData();

      formData.append('name', this.data.name);
      formData.append('category', this.data.category);
      formData.append('amount1', this.data.amount1);
      formData.append('cost', this.data.cost);
      if (this.data.description) formData.append('description', this.data.description);
      if (this.data.img1) formData.append('img1', this.data.img1);
      if (this.data.img2) formData.append('img2', this.data.img2);

      this.productService.postProduct(formData).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            this.start();
            Swal.fire({
              title: 'Creacion Exitosa',
              text: 'Fue creada la categoria ' + this.data.name,
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
  showOverlayPanel(event: Event, item: any) {
    if (this.panelVisible) {
      this.overlayPanel.hide();
    }
    this.data = item;

    this.category = { id: item.category, name: "CERVEZA" }
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
      this.loading = true
      const formData = new FormData();

      formData.append('name', this.data.name);
      formData.append('category', this.category.id);
      formData.append('amount1', this.data.amount1);
      formData.append('cost', this.data.cost);
      if (this.data.description) formData.append('description', this.data.description);
      if (this.data.img1) formData.append('img1', this.data.img1);
      if (this.data.img2) formData.append('img2', this.data.img2);

      this.productService.updateProduct(formData, this.data.id).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            this.start();
            this.loading = false
            Swal.fire({
              title: 'Actualización Exitosa',
              text: 'Categoria Actualizada Exitosamente ',
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
    this.loading = true
    let preload = {
      img2: this.data.img2,
      status: !this.data.status,
    };
    this.productService.updateProduct(preload, this.data.id).subscribe(
      (res: any) => {
        if (res) {
          this.loading = false;
          this.display = false;
          this.start();
          Swal.fire({
            title: 'Cambio de Estado Exitoso',
            text: 'Categoria Actualizada Exitosamente ',
            icon: 'success',
          });
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  search() {
    this.productService.getProduct(this.name).subscribe((res: any) => {
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }
  onChange(event: any) {
    const fileSele = event.target.files[0];
    this.data.img1 = event.target.files[0]
    if (fileSele) {
      this.fileSelect = fileSele;

      const reader = new FileReader();
      reader.onload = e => this.fileSelect = reader.result;
      reader.readAsDataURL(fileSele);
    }
  }
}
