import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardViewWrapperComponent } from './admin-dashboard-view-wrapper.component';

describe('AdminDashboardViewWrapperComponent', () => {
  let component: AdminDashboardViewWrapperComponent;
  let fixture: ComponentFixture<AdminDashboardViewWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboardViewWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardViewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
