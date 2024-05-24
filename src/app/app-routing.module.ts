import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { ProductComponent } from './page/product/product.component';
import { UserComponent } from './page/user/user.component';
import { ClientComponent } from './page/client/client.component';
import { BannerComponent } from './page/banner/banner.component';
import { GroupComponent } from './page/group/group.component';
import { LineComponent } from './page/line/line.component';
import { VariantesComponent } from './page/variantes/variantes.component';
import { ProductoVariantesComponent } from './page/producto-variantes/producto-variantes.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'group',
    component: GroupComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'line',
    component: LineComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'variantes',
    component: VariantesComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'producto_variantes',
    component: ProductoVariantesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'banner',
    component: BannerComponent,
    canActivate: [AuthGuard],
  },
  /*  {
    path: 'profile',
    component: ProfileComponent,
    // canActivate:[IndexGuard],
  },
  {
    path: 'category',
    component: CategoryComponent,
    // canActivate:[IndexGuard],
  },
  {
    path: 'product',
    component: ProductComponent,
    // canActivate:[IndexGuard],
  }, */
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'client',
    component: ClientComponent,
    // canActivate:[IndexGuard],
  } /* ,
  {
    path: 'shoppingCart',
    component: ShoppingCartComponent,
    // canActivate:[IndexGuard],
  },
  {
    path: 'order',
    component: OrderComponent,
    // canActivate:[IndexGuard],
  }, */,
  {
    path: 'banner',
    component: BannerComponent,
    // canActivate:[IndexGuard],
  },
  /*  {
    path: 'rates',
    component: RatesComponent,
    // canActivate:[IndexGuard],
  }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
