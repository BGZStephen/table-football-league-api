import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardTeamsComponent } from './admin-dashboard-teams.component';

describe('AdminDashboardTeamsComponent', () => {
  let component: AdminDashboardTeamsComponent;
  let fixture: ComponentFixture<AdminDashboardTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboardTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
