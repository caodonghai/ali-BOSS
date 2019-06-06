import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantManageComponent } from './tenant-manage.component';

describe('TenantManageComponent', () => {
  let component: TenantManageComponent;
  let fixture: ComponentFixture<TenantManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
