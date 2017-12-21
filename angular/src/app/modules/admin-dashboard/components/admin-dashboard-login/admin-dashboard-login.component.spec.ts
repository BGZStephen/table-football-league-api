import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardLoginComponent } from './admin-dashboard-login.component';

describe('AdminDashboardLoginComponent', () => {
  let component: AdminDashboardLoginComponent;
  let fixture: ComponentFixture<AdminDashboardLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboardLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
