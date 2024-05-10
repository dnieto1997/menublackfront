import { Component } from '@angular/core';
import { BannerService } from './banner.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  public isLoading = false;
  public imagenPrevisualizacion?: string | ArrayBuffer | null = null;
  public imagenSeleccionada?: File | null = null;
  public list: any;
  constructor(private bannerService: BannerService) { }

  ngOnInit(): void {
    this.start();
  }

  start() {
    this.isLoading = true
    this.bannerService.getFiles().subscribe((res) => {
      this.list = res
      this.isLoading = false
    })
  }

  seleccionarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.imagenSeleccionada = archivo;

      const reader = new FileReader();
      reader.onload = e => this.imagenPrevisualizacion = reader.result;
      reader.readAsDataURL(archivo);
    }
  }

  subirImagen(): void {
    if (this.imagenSeleccionada) {
      const formData = new FormData();
      formData.append('file', this.imagenSeleccionada, this.imagenSeleccionada.name);

      this.bannerService.updateFile(formData).subscribe(
        (res) => {
          this.start();
          this.imagenPrevisualizacion = null;
          this.imagenSeleccionada = null;
        },
        (error) => console.error(error)
      );
    }
  }

  delete(id: any) {
    this.isLoading = true
    this.bannerService.delete(id).subscribe((res) => {
      this.start();
    })
  }
}