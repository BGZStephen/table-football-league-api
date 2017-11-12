import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLeaguesComponent } from './dashboard-leagues.component';

describe('DashboardLeaguesComponent', () => {
  let component: DashboardLeaguesComponent;
  let fixture: ComponentFixture<DashboardLeaguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLeaguesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLeaguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
