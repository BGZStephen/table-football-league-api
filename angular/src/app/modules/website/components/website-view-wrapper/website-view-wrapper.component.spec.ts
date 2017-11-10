import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteViewWrapperComponent } from './website-view-wrapper.component';

describe('WebsiteViewWrapperComponent', () => {
  let component: WebsiteViewWrapperComponent;
  let fixture: ComponentFixture<WebsiteViewWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteViewWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteViewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
