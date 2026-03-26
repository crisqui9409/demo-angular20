/**
 *service that provides security utilities: encryption/decryption to protect requests/responses and stored data.
 * @author Yurani Rangel / Contact & Business IT
 * @version 0.1, 2025/12/01
 *
 * Copyright © Todos los derechos reservados Aval Valor Compartido
 *
 * Este software es confidencial y es propiedad de AVC, queda prohibido
 * su uso, reproducción y copia de manera parcial o permanente salvo autorización
 * expresa de Aval Valor Compartido o de quién represente sus derechos.
 */
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { DEFAULT_CONST } from '../utils/global-strings';

@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  /**
   * encryption key for aes
   */
  private readonly aesKey = environment.search.privateKeyCryp;
  /**
   * encrypted text
   */
  encrypted: string = DEFAULT_CONST.EMPTY;
  /**
   * decrypted text
   */
  decrypted: string = DEFAULT_CONST.EMPTY;
  /**
   * saves random numbers IV
   */
  randomNumbers: number[] = [];

  constructor() {
    this.generateSecureRandomNumbers();
  }

  /**
   * function to decrypt the response of a service using JWT,
   * This method is used in multiple services of the application
   * @param token text to decrypt
   * @return decrypted text
   */
  getDecodeToken(token: any): any {
    const jwt = jwtDecode(token);
    return jwt;
  }

  /**
   * Function to encrypt the information for the content of an RQ using AES.
   * It is called for the encryption of the header of the services
   * @param request text to encrypt
   * @return encrypted text
   */
  encryptUsingAES256(request: string) {
    // get the keys
    const keyBytes = CryptoJS.enc.Utf8.parse(this.aesKey);
    const sha = CryptoJS.algo.SHA256.create();
    sha.update(keyBytes);
    const keyHash = sha.finalize();
    // the elements are prepared for the encryption process.
    const keyArray = keyHash.words.slice(0, 4);
    const key = CryptoJS.lib.WordArray.create(keyArray);
    const ivArray = this.randomNumbers;
    let ivString = '';
    for (let i = 0; i < ivArray.length; i++) {
      ivString += String.fromCharCode(ivArray[i] & 0xff);
    }
    const iv = CryptoJS.enc.Latin1.parse(ivString);
    // the input is encrypted
    const encrypted = CryptoJS.AES.encrypt(request, key, {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });
    // the already encrypted value is returned
    return encrypted.toString();
  }

  /**
   * Function to decrypt the information for the content of an RS using AES.
   * @param request text to encrypt
   * @return encrypted text
   */
  decryptUsingAES256(encryptedText: string): any {
    const keyBytes = CryptoJS.enc.Utf8.parse(this.aesKey);
    const sha = CryptoJS.algo.SHA256.create();
    sha.update(keyBytes);
    const keyHash = sha.finalize();
    const keyArray = keyHash.words.slice(0, 4);
    const key = CryptoJS.lib.WordArray.create(keyArray);
    const ivArray = this.randomNumbers;
    let ivString = '';
    for (let i = 0; i < ivArray.length; i++) {
      ivString += String.fromCharCode(ivArray[i] & 0xff);
    }
    const iv = CryptoJS.enc.Latin1.parse(ivString);

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });

    const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);
    return decryptedText;
  }

  /**
   * Function to encrypt the information for the content of an RQ using AES.
   * It is called for the encryption of the header of the services
   * @param request text to encrypt
   * @return encrypted text
   */
  encryptUsingAES256Static(request: string) {
    // get the keys
    const keyBytes = CryptoJS.enc.Utf8.parse(this.aesKey);
    const keyHash = CryptoJS.SHA256(keyBytes);
    // the elements are prepared for the encryption process.
    const keyArray = keyHash.words.slice(0, 4);
    const key = CryptoJS.lib.WordArray.create(keyArray);
    const ivArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const iv = CryptoJS.lib.WordArray.create(ivArray);
    // the input is encrypted
    const encrypted = CryptoJS.AES.encrypt(request, key, {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });
    // the already encrypted value is returned
    return encrypted.toString();
  }

  /**
   * Function to decrypt the information for the content of an RS using AES.
   * @param request text to encrypt
   * @return encrypted text
   */
  decryptUsingAES256Static(encryptedText: string): any {
    const keyBytes = CryptoJS.enc.Utf8.parse(this.aesKey);
    const sha = CryptoJS.algo.SHA256.create();
    sha.update(keyBytes);
    const keyHash = sha.finalize();
    const keyArray = keyHash.words.slice(0, 4);
    const key = CryptoJS.lib.WordArray.create(keyArray);
    const ivArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const iv = CryptoJS.lib.WordArray.create(ivArray);

    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding,
    });

    const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);
    return decryptedText;
  }

  /**
   * Encryption function using the SHA method, used for registered user security questions.
   * @param text text to encrypt
   * @return encrypted text
   */
  encryptSHA256(text: string): string {
    const hash = CryptoJS.SHA256(text);
    const hashedText = hash.toString(CryptoJS.enc.Hex);
    return hashedText;
  }

  /**
   * Base 64 encryption function
   *
   *It is used for the encryption of information that is stored in the storage and of the data that
   * travels in the URL redirection parameters
   * @param str text to encrypt
   * @return encrypted text
   */
  encryptToBase64(str: string): string {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(str);
    return btoa(String.fromCharCode(...data));
  }

  /**
   * Function to decrypt in base64
   * It is used to describe the information that is stored in the storage and the data that travels in the parameters.
   * @param encodedStr text to decrypt
   * @return clear text
   */
  decryptBase64ToString(encodedStr: string): string {
    const decodedString = atob(encodedStr);
    return decodedString;
  }

  /**
   * Function to decrypt in base64 and accept accents
   * Used for frequent payments and session information
   * @param encodedStr text to decrypt
   * @return clear text
   */
  decryptBase64FromLogin(encodedStr: string): string {
    const decodedString = atob(encodedStr);
    return decodeURIComponent(escape(decodedString));
  }

  /**
   * Function to generate random numbers and fill array IV
   * @return void
   */
  generateSecureRandomNumbers() {
    this.randomNumbers = [];
    const buffer = new Uint8Array(16);
    //more difficult to predict, recommended for security environments
    window.crypto.getRandomValues(buffer);
    for (let i = 0; i < 16; i++) {
      this.randomNumbers.push(buffer[i] % 10);
    }
  }

  /**
   * Function to obtain random numbers
   * @return 16 numbers separated by commas
   */
  getRandomNumber() {
    return this.randomNumbers;
  }
}
