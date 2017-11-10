import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteLoginComponent } from './website-login.component';

describe('WebsiteLoginComponent', () => {
  let component: WebsiteLoginComponent;
  let fixture: ComponentFixture<WebsiteLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
