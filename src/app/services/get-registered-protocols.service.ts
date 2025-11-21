import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Protocol, RegProtocol} from '../interfaces/protocol';
import {isProd} from '../helpers/isProd';

@Injectable({
  providedIn: 'root'
})
export class GetRegisteredProtocolsService {
  http = inject(HttpClient);

  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  getRegisteredProtocolsByInstructionIdAndProtTemplateId(instructionId: number, protocolTemplateId: number): Observable<RegProtocol[]> {
    const params = new HttpParams({ fromObject: { instructionId, protocolTemplateId } });
    return this.http.get<RegProtocol[]>(`${this.baseApiUrl}/get-registered-protocols-by-ids`, { params });
  }
  getRegisteredProtocolByProtocolId(protocolId: number): Observable<Protocol[]> {
    const params = new HttpParams({ fromObject: { protocolId } });
    return this.http.get<Protocol[]>(`${this.baseApiUrl}/get-registered-protocol-by-id`, { params });
  }
}
