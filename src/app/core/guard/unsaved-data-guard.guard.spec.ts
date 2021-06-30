import { TestBed } from '@angular/core/testing';

import { UnsavedDataGuard } from './unsaved-data-guard.guard';

describe('UnsavedDataGuard', () => {
  let guard: UnsavedDataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnsavedDataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
