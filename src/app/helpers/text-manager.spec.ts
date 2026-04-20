import { clearTextRegx, sliceByLength } from './text-manager';
import { regularExpressions } from '../utils/regular-expresssions';

describe('TextManager', () => {
  describe('clearTextRegx', () => {
    it('should remove characters that do not match the provided pattern', () => {
      const text = 'Hello 123 World!';
      const onlyNumbers = /^[0-9]*$/;
      // Note: clearTextRegx uses regularExpressions.eachCharacter internally
      const result = clearTextRegx(text, onlyNumbers);
      expect(result).toBe('123');
    });

    it('should return empty string if no characters match', () => {
      const text = 'abc';
      const onlyNumbers = /^[0-9]*$/;
      const result = clearTextRegx(text, onlyNumbers);
      expect(result).toBe('');
    });

    it('should keep all characters if they all match the pattern', () => {
      const text = '123456';
      const onlyNumbers = /^[0-9]*$/;
      const result = clearTextRegx(text, onlyNumbers);
      expect(result).toBe('123456');
    });
  });

  describe('sliceByLength', () => {
    it('should return the original text if length is less than or equal to maxLength', () => {
      const text = 'Hello';
      expect(sliceByLength(text, 10)).toBe('Hello');
      expect(sliceByLength(text, 5)).toBe('Hello');
    });

    it('should cut text and add ellipsis if length exceeds maxLength', () => {
      const text = 'Hello World';
      const maxLength = 5;
      const result = sliceByLength(text, maxLength);
      // Expected result depends on DEFAULT_CONST.ELLIPSIS (likely '...')
      expect(result).toBe('Hello...'); 
    });

    it('should handle empty strings', () => {
      expect(sliceByLength('', 5)).toBe('');
    });
  });
});
