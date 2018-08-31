import { TestBed, inject } from '@angular/core/testing';

import { PoliticasService } from './politicas.service';

describe('PoliticasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoliticasService]
    });
  });

  it('should be created', inject([PoliticasService], (service: PoliticasService) => {
    expect(service).toBeTruthy();
  }));
});
