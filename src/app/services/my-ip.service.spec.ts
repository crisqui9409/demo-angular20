import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MyIpService } from './my-ip.service';
import { EncryptService } from './encrypt.service';
import { DEFAULT_CONST } from '../utils/global-strings';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

describe('MyIpService', () => {
  let service: MyIpService;
  let httpMock: HttpTestingController;
  let encryptServiceSpy: jasmine.SpyObj<EncryptService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EncryptService', ['decryptUsingAES256Static', 'getDecodeToken']);

    TestBed.configureTestingModule({
      providers: [
        MyIpService,
        { provide: EncryptService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MyIpService);
    httpMock = TestBed.inject(HttpTestingController);
    encryptServiceSpy = TestBed.inject(EncryptService) as jasmine.SpyObj<EncryptService>;
    
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMyIp', () => {
    it('should return IP from localStorage if it exists and is not default', (done) => {
      const mockIp = '192.168.1.1';
      localStorage.setItem('userIp', mockIp);

      service.getMyIp().subscribe(ip => {
        expect(ip).toBe(mockIp);
        done();
      });
    });

    it('should call backend and return decoded IP if not in localStorage', (done) => {
      const mockEncryptedToken = 'encrypted-token';
      const mockDecryptedToken = 'decrypted-token';
      const mockDecodedToken = { sub: JSON.stringify({ result: '10.0.0.1' }) };

      encryptServiceSpy.decryptUsingAES256Static.and.returnValue(mockDecryptedToken);
      encryptServiceSpy.getDecodeToken.and.returnValue(mockDecodedToken);

      service.getMyIp().subscribe(ip => {
        expect(ip).toBe('10.0.0.1');
        expect(localStorage.getItem('userIp')).toBe('10.0.0.1');
        done();
      });

      const req = httpMock.expectOne(environment.client.baseUrl + environment.client.ip);
      expect(req.request.method).toBe('GET');
      req.flush(mockEncryptedToken);
    });

    it('should return default IP and save it to localStorage on error', (done) => {
      service.getMyIp().subscribe(ip => {
        expect(ip).toBe(DEFAULT_CONST.DEFAULT_IP);
        expect(localStorage.getItem('userIp')).toBe(DEFAULT_CONST.DEFAULT_IP);
        done();
      });

      const req = httpMock.expectOne(environment.client.baseUrl + environment.client.ip);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getStorageIp', () => {
    it('should return stored IP from localStorage', () => {
      localStorage.setItem('userIp', '127.0.0.1');
      expect(service.getStorageIp()).toBe('127.0.0.1');
    });

    it('should return default IP if nothing in localStorage', () => {
      expect(service.getStorageIp()).toBe(DEFAULT_CONST.DEFAULT_IP);
    });
  });
});
