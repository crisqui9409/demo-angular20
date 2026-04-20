import { TestBed } from '@angular/core/testing';
import { EncryptService } from './encrypt.service';

describe('EncryptService', () => {
  let service: EncryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('AES-256 CTR Encryption/Decryption', () => {
    it('should encrypt and decrypt a string correctly using AES-256 CTR', () => {
      const plainText = 'Hello security world!';
      const encrypted = service.encryptUsingAES256(plainText);
      expect(encrypted).not.toBe(plainText);
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = service.decryptUsingAES256(encrypted);
      expect(decrypted).toBe(plainText);
    });

    it('should handle empty strings for AES-256 CTR', () => {
      const plainText = '';
      const encrypted = service.encryptUsingAES256(plainText);
      const decrypted = service.decryptUsingAES256(encrypted);
      expect(decrypted).toBe(plainText);
    });
  });

  describe('Static AES-256 CTR Encryption/Decryption', () => {
    it('should encrypt and decrypt a string correctly using Static AES-256 CTR', () => {
      const plainText = 'Static secret message';
      const encrypted = service.encryptUsingAES256Static(plainText);
      expect(encrypted).not.toBe(plainText);

      const decrypted = service.decryptUsingAES256Static(encrypted);
      expect(decrypted).toBe(plainText);
    });
  });

  describe('SHA256 Hashing', () => {
    it('should generate a consistent SHA256 hash', () => {
      const text = 'test password';
      const hash1 = service.encryptSHA256(text);
      const hash2 = service.encryptSHA256(text);
      
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 hex result is 64 characters
    });

    it('should generate different hashes for different texts', () => {
      const hash1 = service.encryptSHA256('text1');
      const hash2 = service.encryptSHA256('text2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Base64 Encoding/Decoding', () => {
    it('should encode and decode to base64 correctly', () => {
      const text = 'Base64 test string';
      const encoded = service.encryptToBase64(text);
      expect(encoded).not.toBe(text);
      
      const decoded = service.decryptBase64ToString(encoded);
      expect(decoded).toBe(text);
    });

    it('should handle special characters in decryptBase64FromLogin', () => {
        // "¡Hola!" encoded with encodeURIComponent + escape + btoa logic
        const text = '¡Hola Mundo!';
        const encoded = btoa(unescape(encodeURIComponent(text)));
        const decoded = service.decryptBase64FromLogin(encoded);
        expect(decoded).toBe(text);
    });
  });

  describe('Random Number Generation', () => {
    it('should generate 16 secure random numbers', () => {
      service.generateSecureRandomNumbers();
      const numbers = service.getRandomNumber();
      expect(numbers.length).toBe(16);
      numbers.forEach(n => {
        expect(n).toBeLessThan(10);
        expect(n).toBeGreaterThanOrEqual(0);
      });
    });

    it('should regenerate different numbers when called again', () => {
        service.generateSecureRandomNumbers();
        const first = [...service.getRandomNumber()];
        service.generateSecureRandomNumbers();
        const second = service.getRandomNumber();
        expect(first).not.toEqual(second);
    });
  });
});
