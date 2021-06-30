import { TestBed } from '@angular/core/testing';

import { DocumentArchivesService } from './document-archives.service';

describe('DocumentArchivesService', () => {
  let service: DocumentArchivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentArchivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
