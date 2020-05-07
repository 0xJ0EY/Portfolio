import { TestBed } from '@angular/core/testing';

import { CubeService } from './cube.service';

describe('CubeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CubeService = TestBed.inject(CubeService);
    expect(service).toBeTruthy();
  });
});
