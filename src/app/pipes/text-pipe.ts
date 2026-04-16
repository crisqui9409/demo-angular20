/**
 * textPipe – Angular 20 Standalone
 * ─────────────────────────────────────────────────────────────────
 * Pipe for translating texts from pages and components
 *
 * @author  : Natalia Melendez / Contact & Business IT
 * @version : 1.0 – 2026/04/15
 * ─────────────────────────────────────────────────────────────────
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationMap } from '../interfaces/interface_pipe';
import { ES_AVATAR, ES_INPUT_SELECT, ES_INPUT_TEXT, ES_PLAYGROUND } from '../utils/lang/es_component';
import { SupportedLanguages } from '../types/global_type';

@Pipe({
  name: 'text',
  standalone: true
})
export class TextPipe implements PipeTransform {

  private translationMap: { [language: string]: TranslationMap } = {
    'ES': {
      ES_INPUT_SELECT, 
      ES_AVATAR,
      ES_INPUT_TEXT,
      ES_PLAYGROUND
    },
  };

  transform(value: string, language: SupportedLanguages = 'ES'): string {
    if (!this.translationMap[language]) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const [moduleName, ...keys] = value.split('.');
    const module = this.translationMap[language][moduleName];

    if (!module) {
      return value;
    }

    const translatedValue = this.getNestedTranslation(module, keys.join('.'));
    return translatedValue ? translatedValue : value;
  }

  private getNestedTranslation(translations: any, key: string): any {
    if (!translations) {
      return undefined;
    }

    return key.split('.').reduce((obj, keyPart) => obj && obj[keyPart], translations);
  }
}
