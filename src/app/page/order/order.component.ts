import { Component, ViewChild } from '@angular/core';
import { OrderService } from './order.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public subtotal: any = 0;
  public totalTable: any = 0;
  public isEdit: boolean = false;
  public panelVisible: boolean = false;
  public nameCli: string = ''
  public idorder: string = ''
  public status: string = ''

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.start();
  }

  start() {
    this.subtotal = 0;
    this.totalTable = 0;
    const preload = { namcli: this.nameCli, idorder: this.idorder }
    this.orderService.getOrders(preload).subscribe((res: any) => {
      this.list = res;
      res.forEach((element: any) => {
        this.subtotal = this.subtotal + parseInt(element.subtotal);
        this.totalTable = this.totalTable + parseInt(element.total);
      });
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }

  openModal(item: any) {
    this.display = true;
    this.data = item;
  }

  changeStatus() {
    let payload = {
      total: this.data.total,
      subtotal: this.data.subtotal,
      domicilio: this.data.domicilio,
      direccion: this.data.direccion,
      mediopago: this.data.mediopago,
      status: this.data.status,
    };
    this.orderService.updateOrder(payload, this.data.id).subscribe(
      (res: any) => {
        if (res) {
          this.display = false;
          this.start();
          Swal.fire({
            title: 'Cambio de Estado Exitoso',
            text: 'Orden Actualizada Exitosamente ',
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
    this.subtotal = 0;
    this.totalTable = 0;
    const preload = { namcli: this.nameCli, idorder: this.idorder, status: this.status }
    this.orderService.getOrders(preload).subscribe((res: any) => {
      this.list = res;
      res.forEach((element: any) => {
        this.subtotal = this.subtotal + parseInt(element.subtotal);
        this.totalTable = this.totalTable + parseInt(element.total);
      });
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }
}
