import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {isProd} from '../helpers/isProd';

@Injectable({
  providedIn: 'root'
})
export class RegisterProtocolService {
  http = inject(HttpClient);

  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  sendRegisteredProtocol(protocolData: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/register-protocol`, protocolData);
  }

}
