import { TestBed } from '@angular/core/testing';

import { DocumentUpload } from './document-upload';

describe('DocumentUpload', () => {
  let service: DocumentUpload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentUpload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
