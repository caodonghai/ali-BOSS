import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPercentComponent } from './product-percent.component';

describe('ProductPercentComponent', () => {
  let component: ProductPercentComponent;
  let fixture: ComponentFixture<ProductPercentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPercentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
