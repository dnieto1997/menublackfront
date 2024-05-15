import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantesComponent } from './variantes.component';

describe('VariantesComponent', () => {
  let component: VariantesComponent;
  let fixture: ComponentFixture<VariantesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantesComponent]
    });
    fixture = TestBed.createComponent(VariantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
