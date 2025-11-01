import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Instruction} from '../interfaces/instruction';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructionsByIdService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';
  getInstructionsById(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-id`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class InstructionsByWorkshopService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';

  getInstructionsByWorkshopId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-w`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class InstructionsByDepartmentService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';

  getInstructionsByDepartmentId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-d`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class InstructionsBySectionService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';


  getInstructionsBySectiontId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-s`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class InstructionsByUnitService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';

  getInstructionsByUnitId(id: number): Observable<Instruction[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-u`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class InstructionsByQuickSearchService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';

  getInstructionsByQuickSearch(searchReq: string): Observable<Instruction[]> {
    const params = new HttpParams()
      .set('searchReq', searchReq)
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-qs`, {params});
  }
}

