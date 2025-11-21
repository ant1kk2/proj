import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Protocol} from '../interfaces/protocol';
import {isProd} from '../helpers/isProd';

@Injectable({
  providedIn: 'root'
})
export class GetProtocolsService {

  http = inject(HttpClient);

  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  getProtocolsByInstructionId(id: number): Observable<Protocol[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Protocol[]>(`${(this.baseApiUrl)}/get-protocols-by-instruction`, {params});
  }
  getProtocolsByTemplateId(id: number): Observable<Protocol[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Protocol[]>(`${(this.baseApiUrl)}/get-protocols-by-template-id`, {params});
  }
}
