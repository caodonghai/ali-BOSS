import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPermissionSettingComponent } from './app-permission-setting.component';

describe('AppPermissionSettingComponent', () => {
  let component: AppPermissionSettingComponent;
  let fixture: ComponentFixture<AppPermissionSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPermissionSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPermissionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
