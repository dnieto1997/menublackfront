import { Component } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent {
  public loading: boolean = true;
  public showTable: boolean = false;
  public display: boolean = false;
  public squeleto: boolean = true;
  public list: any[] = [];
  public data: any = {};
  public totalCart: any = 0;
  public totalCost: any = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.start();
  }
  start() {
    this.shoppingCartService.getCart({}).subscribe((res: any) => {
      this.list = res;
      res.forEach((element: any) => {
        this.totalCart = this.totalCart + parseInt(element.amount_t);
        this.totalCost = this.totalCost + parseInt(element.cost);
      });
      this.loading = false;
      this.showTable = true;
      this.squeleto = false;
    });
  }
}
