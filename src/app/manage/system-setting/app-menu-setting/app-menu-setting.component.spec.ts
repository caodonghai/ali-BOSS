import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenuSettingComponent } from './app-menu-setting.component';

describe('AppMenuSettingComponent', () => {
  let component: AppMenuSettingComponent;
  let fixture: ComponentFixture<AppMenuSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMenuSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMenuSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
