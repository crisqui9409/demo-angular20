/**
 * Service to obtain the user's IP address to manage the audit
 * @author Natalia Melendez / Contact & Business IT
 * @version 1.0, 2024/07/06
 *
 * Copyright © Derechos reservados Aval Valor Compartido
 *
 * Este software es confidencial y es propiedad de AVC, queda prohibido
 * su uso, reproducción y copia de manera parcial o permanente salvo autorización
 * expresa de Aval Valor Compartido o de quién represente sus derechos.
 */

import { Injectable } from '@angular/core';
import { DEFAULT_CONST } from '../utils/global-strings';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EncryptService } from './encrypt.service';

@Injectable({
  providedIn: 'root',
})
export class MyIpService {
  /**
   * Constructor to obtain the user's IP address to manage the audit
   * @param http Client for connection to a service offered through an http address
   * @param encrypt Encrypt service for the security of information traveling to and from backend services
   * @return void
   */
  constructor(
    private readonly http: HttpClient,
    private readonly encrypt: EncryptService,
  ) {}

  /**
   * Function to obtain the user's IP address to manage the audit
   * Calls the back service that obtains the user's IP address and returns it in string format
   * @param body body del RQ al servicio
   * @return resultado del servicio
   */
  getMyIp(): Observable<string> {
    const storedIp = localStorage.getItem('userIp');

    if (storedIp && storedIp !== DEFAULT_CONST.DEFAULT_IP) {
      return of(storedIp);
    } else {
      return this.http.get(environment.client.baseUrl + environment.client.ip, { responseType: 'text' }).pipe(
        map((token: string) => {
          const decryptToken = this.encrypt.decryptUsingAES256Static(token);
          const decodeToken = this.encrypt.getDecodeToken(decryptToken);
          return decodeToken;
        }),
        map((decodeToken) => {
          const ip = JSON.parse(decodeToken.sub);
          localStorage.setItem('userIp', ip.result);
          return ip.result;
        }),
        catchError(() => {
          localStorage.setItem('userIp', DEFAULT_CONST.DEFAULT_IP);
          return of(DEFAULT_CONST.DEFAULT_IP);
        }),
      );
    }
  }

  getStorageIp(): string {
    const storedIp = localStorage.getItem('userIp');
    if (storedIp) {
      return storedIp;
    } else {
      return DEFAULT_CONST.DEFAULT_IP;
    }
  }
}
