import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationNoticeComponent } from './information-notice.component';

describe('InformationNoticeComponent', () => {
  let component: InformationNoticeComponent;
  let fixture: ComponentFixture<InformationNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
