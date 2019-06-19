import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionSettingComponent } from './permission-setting.component';

describe('PermissionSettingComponent', () => {
  let component: PermissionSettingComponent;
  let fixture: ComponentFixture<PermissionSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
