/**
 * Useful functions for text management
 * @author Natalia Melendez / Contact & Business IT
 * @version 0.1, 2025/01/16
 */

import { DEFAULT_CONST } from "../utils/global-strings";
import { regularExpressions } from "../utils/regular-expresssions";


/**
 * Function that removes all characters from an input text that do not match a defined pattern.
 * @param oldText Input text to be evaluated and cleaned
 * @param pattern Regular expression of the characters allowed within the text
 * @return string
 */
export function clearTextRegx(oldText: string, pattern: RegExp): string {
    let newValue = oldText;
    // Se utiliza la expresión regular global para evaluar cada carácter
    newValue = oldText.replace(regularExpressions.eachCharacter, (character) => {
        return pattern.test(character) ? character : DEFAULT_CONST.EMPTY;
    });
    return newValue;
}

/**
 * The function is responsible for cutting a string according to the maximum number 
 * of characters indicated and at the end of it.
 * If the text is longer, it cuts it and puts an ellipsis at the end, 
 * otherwise it returns the same.
 * @param oldText Text to be evaluated and cut
 * @param maxLength Maximum number of characters to display
 * @return string
 */
export function sliceByLength(oldText: string, maxLength: number): string {
    if (oldText.length > maxLength) {
        return oldText.slice(0, maxLength) + DEFAULT_CONST.ELLIPSIS;
    } else {
        return oldText;
    }
}