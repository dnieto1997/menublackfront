import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from './category.service';
import Swal from 'sweetalert2';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public isEdit: boolean = false;
  public panelVisible: boolean = false;
  public name: string = ''
  public fileSelect?: string | ArrayBuffer | null = null;
  public fileSelect2?: string | ArrayBuffer | null = null;

  constructor(private categoryService: CategoryService) { }

  showOverlayPanel(event: Event, item: any) {
    if (this.panelVisible) {
      this.overlayPanel.hide();
    }
    this.data = item;
    this.fileSelect2 = item.img2
    setTimeout(() => {
      this.overlayPanel.toggle(event);
    }, 200);
  }

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.categoryService.getCategory('').subscribe((res: any) => {
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
  createCategory() {
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
      if (this.data.description) formData.append('description', this.data.description);
      if (this.data.img2) formData.append('img2', this.data.img2);

      this.categoryService.postCategory(formData).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            this.start();
            this.loading = false
            this.fileSelect = null
            this.fileSelect2 = null
            Swal.fire({
              title: 'Creacion Exitosa',
              text: 'Fue creada la categoria ' + this.data.name,
              icon: 'success',
            });
          }
        },
        (error: any) => {
          this.loading = false
          console.log(error);
        }
      );
    }
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
      if (this.data.description) formData.append('description', this.data.description);
      if (this.data.img2) formData.append('img2', this.data.img2);
      this.categoryService.updateCategory(formData, this.data.id).subscribe(
        (res: any) => {
          if (res) {
            this.display = false;
            this.loading = false
            this.start();
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
    this.loading = true;
    let preload = {
      name: this.data.name,
      description: this.data.description,
      img2: this.data.img2,
      imgarr: this.data.imgarr,
      status: !this.data.status,
    };

    this.categoryService.updateCategory(preload, this.data.id).subscribe(
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
    this.categoryService.getCategory(this.name).subscribe((res: any) => {
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }

  onChange(event: any) {
    const fileSele2 = event.target.files[0];
    this.data.img2 = event.target.files[0]
    if (fileSele2) {
      this.fileSelect2 = fileSele2;

      const reader = new FileReader();
      reader.onload = e => this.fileSelect2 = reader.result;
      reader.readAsDataURL(fileSele2);
    }
  }
}
