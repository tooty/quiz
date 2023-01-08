import { TestBed } from '@angular/core/testing';

import { GamemasterService } from './gamemaster.service';

describe('GamemasterService', () => {
  let service: GamemasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamemasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
