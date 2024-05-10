import { Component } from '@angular/core';
import { ClientService } from './client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.clientService.getUser({}).subscribe((res: any) => {
      this.list = res;
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }
  

}
