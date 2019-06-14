import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeChartComponent } from './distribute-chart.component';

describe('DistributeChartComponent', () => {
  let component: DistributeChartComponent;
  let fixture: ComponentFixture<DistributeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
