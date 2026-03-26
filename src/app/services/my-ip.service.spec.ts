import { TestBed } from '@angular/core/testing';

import { MyIpService } from './my-ip.service';

describe('MyIpService', () => {
  let service: MyIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
