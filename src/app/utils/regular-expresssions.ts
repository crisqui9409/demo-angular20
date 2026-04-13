/**
 * Regular expressions for evaluating form inputs
 * @author Cristian Quintana / Contact & Business IT
 * @version 1.0, 202/04/13
 */

export const regularExpressions: any = {
    /**
     * Supports any character
     */
    anyCharacter: /.*/,
    /**
     * Loop through all characters in a string
     */
    eachCharacter: /./g,
    /**
     * Supports all letters of the alphabet and digits from 0 to 9
     */
    lettersAndNumbers :/^[a-zA-Z0-9]*$/,
    /**
     * Supports all numbers on Colombia Country
     */
    celularPhone: /^(3[0-9]{2})([0-9]{7})$/,
    /**
     * Supports all alphanumerics keys
     */
    alphanumeric: /^@[a-zA-Z0-9]+$/,
    /**
     * Supports all emails
     */
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    /**
     * Supports only numbers
     */
    onlyNumbers: /^[0-9]*$/,
};