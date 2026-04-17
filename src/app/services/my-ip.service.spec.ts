import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MyIpService } from './my-ip.service';

describe('MyIpService', () => {
  let service: MyIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MyIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
