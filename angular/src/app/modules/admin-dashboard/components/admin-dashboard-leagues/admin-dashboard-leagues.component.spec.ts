import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardLeaguesComponent } from './admin-dashboard-leagues.component';

describe('AdminDashboardLeaguesComponent', () => {
  let component: AdminDashboardLeaguesComponent;
  let fixture: ComponentFixture<AdminDashboardLeaguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboardLeaguesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardLeaguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
