import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent {
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public display2: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {
    group:''
  };
  public data2: any = {};
  public groups: any = {};

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.findAll();
    this.findGroup();
  }

  findAll() {
    this.auth.findAllLine({}).subscribe((res: any) => {
      console.log(res);
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }

  findGroup() {
    this.auth.findAllGroup({}).subscribe((res: any) => {
      this.groups = res;
    });
  }

  openModal() {
    this.display = true;
  }

  async createGroup() {
    console.log(this.data)

    if (
      !this.data.img ||
      !this.data.code ||
      !this.data.position ||
      !this.data.name ||
      !this.data.observations ||
      this.data.group == 0
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
      });
      return;
    } else {
      this.auth.createLine(this.data).subscribe(
        (res: any) => {
          if (res) {
            Swal.fire({
              title: 'Creacion Exitosa',
              text: res.message,
              icon: 'success'
            }).then(() => {
              this.findAll();
            });
            this.display = false;
            this.data={}
          }
        },
        (error: any) => {
          console.log(error.error.statusText);
          if (error.statusText == 'Unauthorized') {
            this.auth.close();
          }
          console.log(error);
        }
      );
    }
  }

  toggleUserStatus(id: any, status: any) {
    this.auth.updateLineStatus(id, { status }).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Status Changed',
          text: 'User status Was Changed: ' + (status ? 'Desactivate' : 'Activate'),
          icon: 'success'
        });
        this.findAll();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  verificarURLImagen(url: string): string {
    if (url.startsWith('https://')) {
      return url;
    } else {
      return '../../../assets/noimage.jpg';
    }
  }

  eliminar(cadena: string): string {
    return cadena.replace(/[\[\]"]/g, '');
  }

  openEditDialog(item: any) {
    this.display2=true
    this.auth.findline(item).subscribe((res: any) => {
      console.log(res)
      this.data2 = res;
    });
  }

  EditGroup(id: any) {
    if (typeof this.data2.days === 'string') {
      try {
        this.data2.days = JSON.parse(this.data2.days);
      } catch (error) {
        console.error('Error al convertir el string en array:', error);
      }
    }
    this.auth.updateLine(id, {
      img:this.data2.img,
      position:this.data2.position,
      code:this.data2.code,
       group:this.data2.group,
       name:this.data2.name,
       observations:this.data2.observation

      
    }).subscribe(
      (res: any) => {
        if (res.status == 201) {
          Swal.fire({
            title: 'Success',
            text: res.message,
            icon: 'success',
          });
          this.findAll();
          this.display2 = false;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
