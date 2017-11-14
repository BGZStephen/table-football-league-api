import { TestBed, inject } from '@angular/core/testing';

import { RedirectionService } from './redirection.service';

describe('RedirectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectionService]
    });
  });

  it('should be created', inject([RedirectionService], (service: RedirectionService) => {
    expect(service).toBeTruthy();
  }));
});
