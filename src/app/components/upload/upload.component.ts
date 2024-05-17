import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { throwError } from 'rxjs';
import { BannerService } from 'src/app/page/banner/banner.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Input() uploadUrl: string = '';
  public status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial'; // Variable to store file status
  public file: File | null = null; // Variable to store file
  public fileSelect?: string | ArrayBuffer | null = null;
  public isLoading = false;
  @Output() datSent = new EventEmitter<string>();

  constructor(private http: BannerService) {}

  ngOnInit(): void {}

  onChange(event: any) {
    const file: File = event.target.files[0];
    const fileSele = event.target.files[0];
    console.log(file);
    if (file) {
      this.fileSelect = fileSele;

      const reader = new FileReader();
      reader.onload = (e) => (this.fileSelect = reader.result);
      reader.readAsDataURL(file);
    }

    if (file) {
      this.status = 'initial';
      this.file = file;
    }
  }
  /* 
  onUpload() {
    if (this.file) {
      const formData = new FormData();

      formData.append('file', this.file, this.file.name);

      const upload$ = this.http.updateFile(formData);

      this.isLoading = true

      upload$.subscribe({
        next: () => {
          this.isLoading = false
          this.file = null
          this.fileSelect = null
          this.datSent.emit("success")
        },
        error: (error: any) => {
          this.isLoading = false
          return throwError(() => error);
        },
      });
    }
  } */
}
