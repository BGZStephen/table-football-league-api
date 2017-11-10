import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewWrapperComponent } from './dashboard-view-wrapper.component';

describe('DashboardViewWrapperComponent', () => {
  let component: DashboardViewWrapperComponent;
  let fixture: ComponentFixture<DashboardViewWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardViewWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardViewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
