import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteContactComponent } from './website-contact.component';

describe('WebsiteContactComponent', () => {
  let component: WebsiteContactComponent;
  let fixture: ComponentFixture<WebsiteContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
