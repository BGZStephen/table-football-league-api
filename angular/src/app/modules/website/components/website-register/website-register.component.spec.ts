import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteRegisterComponent } from './website-register.component';

describe('WebsiteRegisterComponent', () => {
  let component: WebsiteRegisterComponent;
  let fixture: ComponentFixture<WebsiteRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
