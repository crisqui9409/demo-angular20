import { TextPipe } from './text-pipe';
import { SupportedLanguages } from '../types/global_type';

describe('TextPipe', () => {
  let pipe: TextPipe;

  beforeEach(() => {
    pipe = new TextPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the translation for a valid nested ES key', () => {
    const val = 'ES_INPUT_SELECT.DEFAULT_OPTIONS.SELECT';
    expect(pipe.transform(val, 'ES')).toBe('Selecciona');
  });

  it('should throw an error for an unsupported language', () => {
    const unsupportedLang = 'FR' as any;
    expect(() => pipe.transform('ES_INPUT_SELECT.DEFAULT_OPTIONS.SELECT', unsupportedLang)).toThrowError('Unsupported language: FR');
  });

  it('should return the original value if the module does not exist', () => {
    const val = 'NON_EXISTENT_MODULE.KEY';
    expect(pipe.transform(val, 'ES')).toBe(val);
  });

  it('should return the original value if the key does not exist within the module', () => {
    const val = 'ES_INPUT_SELECT.NON_EXISTENT_KEY';
    expect(pipe.transform(val, 'ES')).toBe(val);
  });

  it('should return the original value if the nested key resolution returns undefined', () => {
    const val = 'ES_INPUT_SELECT.DEFAULT_OPTIONS.NON_EXISTENT';
    expect(pipe.transform(val, 'ES')).toBe(val);
  });

  it('should return the original value if the value is not properly formatted (missing module)', () => {
    const val = 'SomethingWithoutDot';
    expect(pipe.transform(val, 'ES')).toBe(val);
  });

  it('should handle falsy module correctly', () => {
    const val = 'MISSING_MODULE.KEY';
    expect(pipe.transform(val, 'ES')).toBe(val);
  });

  it('should handle falsy translations in getNestedTranslation directly', () => {
    const result = (pipe as any).getNestedTranslation(null, 'any.key');
    expect(result).toBeUndefined();
  });

  it('should resolve nested keys with truthy values in the middle', () => {
    expect(pipe.transform('ES_INPUT_SELECT.DEFAULT_OPTIONS.SELECT', 'ES')).toBe('Selecciona');
  });

  it('should handle undefined intermediate keys in nested resolution', () => {
    const val = 'ES_INPUT_SELECT.MISSING.KEY';
    expect(pipe.transform(val, 'ES')).toBe(val);
  });

  it('should use the default language ES if not provided', () => {
    const val = 'ES_INPUT_SELECT.DEFAULT_OPTIONS.SELECT';
    expect(pipe.transform(val)).toBe('Selecciona');
  });
});