import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFixturesComponent } from './dashboard-fixtures.component';

describe('DashboardFixturesComponent', () => {
  let component: DashboardFixturesComponent;
  let fixture: ComponentFixture<DashboardFixturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFixturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFixturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
