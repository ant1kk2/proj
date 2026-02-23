import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Instruction} from '../interfaces/instruction';
import {Observable} from 'rxjs';
import {isProd} from '../helpers/isProd';

@Injectable({
  providedIn: 'root'
})
export class InstructionService {
  http = inject(HttpClient);

  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  getInstructionsAll(): Observable<Instruction[]> {
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions`);
  }

  getInstructionsById(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-id`, {params});
  }

  getInstructionsByWorkshopId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-w`, {params});
  }

  getInstructionsByDepartmentId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-d`, {params});
  }

  getInstructionsBySectiontId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-s`, {params});
  }

  getInstructionsByUnitId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-u`, {params});
  }

  getInstructionsByQuickSearch(searchReq: string): Observable<Instruction[]> {
    const params = new HttpParams()
      .set('searchReq', searchReq)
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-qs`, {params});
  }

  uploadForm(data: any): Observable<any> {
    const formData = new FormData();

    for (const key in data) {
      if (data[key] instanceof File) {
        formData.append(key, data[key], data[key].name);
      } else {
        formData.append(key, data[key]);
      }
    }

    return this.http.post(`${this.baseApiUrl}/upload-instruction`, formData);
  }
}
