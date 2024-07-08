import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { TranslationPipe } from './pipe/translation.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { ProfileComponent } from './page/profile/profile.component';
import { CategoryComponent } from './page/category/category.component';
import { DialogModule } from 'primeng/dialog';
import { ProductComponent } from './page/product/product.component';
import { UserComponent } from './page/user/user.component';
import { ClientComponent } from './page/client/client.component';
import { ShoppingCartComponent } from './page/shopping-cart/shopping-cart.component';
import { OrderComponent } from './page/order/order.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { BannerComponent } from './page/banner/banner.component';
import { UploadComponent } from './components/upload/upload.component';
import { RatesComponent } from './page/rates/rates.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { GroupComponent } from './page/group/group.component';
import { LineComponent } from './page/line/line.component';
import { VariantesComponent } from './page/variantes/variantes.component';
import { ProductoVariantesComponent } from './page/producto-variantes/producto-variantes.component';
import { ProductoGroupsComponent } from './page/producto-groups/producto-groups.component';
import { RatingModule } from 'primeng/rating';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingComponent,
    NavbarComponent,
    DashboardComponent,
    SidebarComponent,
    TranslationPipe,
    ProfileComponent,
    CategoryComponent,
    ProductComponent,
    UserComponent,
    ClientComponent,
    ShoppingCartComponent,
    OrderComponent,
    BannerComponent,
    UploadComponent,
    RatesComponent,
    GroupComponent,
    LineComponent,
    VariantesComponent,
    ProductoVariantesComponent,
    ProductoGroupsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule,
    SkeletonModule,
    CalendarModule,
    AutoCompleteModule,
    TableModule,
    DropdownModule,
    DialogModule,
    OverlayPanelModule,
    CarouselModule,
    TagModule,
    ToastModule,
    EditorModule,
    RatingModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
