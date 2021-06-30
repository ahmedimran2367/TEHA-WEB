import { TestBed } from '@angular/core/testing';

import { ContactPersonsService } from './contact-persons.service';

describe('ContactPersonsService', () => {
  let service: ContactPersonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactPersonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
