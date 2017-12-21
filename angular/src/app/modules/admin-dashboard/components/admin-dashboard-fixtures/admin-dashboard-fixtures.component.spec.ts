import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardFixturesComponent } from './admin-dashboard-fixtures.component';

describe('AdminDashboardFixturesComponent', () => {
  let component: AdminDashboardFixturesComponent;
  let fixture: ComponentFixture<AdminDashboardFixturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboardFixturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardFixturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
