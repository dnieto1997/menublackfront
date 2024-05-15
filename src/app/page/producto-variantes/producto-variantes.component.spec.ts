import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoVariantesComponent } from './producto-variantes.component';

describe('ProductoVariantesComponent', () => {
  let component: ProductoVariantesComponent;
  let fixture: ComponentFixture<ProductoVariantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoVariantesComponent]
    });
    fixture = TestBed.createComponent(ProductoVariantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
