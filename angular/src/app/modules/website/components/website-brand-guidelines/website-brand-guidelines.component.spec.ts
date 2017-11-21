import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteBrandGuidelinesComponent } from './website-brand-guidelines.component';

describe('WebsiteBrandGuidelinesComponent', () => {
  let component: WebsiteBrandGuidelinesComponent;
  let fixture: ComponentFixture<WebsiteBrandGuidelinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteBrandGuidelinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteBrandGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
