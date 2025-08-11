import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Instruction} from '../interfaces/instruction';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';

  getInstructions() {
    return this.http.get<Instruction[]>(`${this.baseApiUrl}/get-instructions`);
  }
}


@Injectable({
  providedIn: 'root'
})
export class InstructionsByWorkshopService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';

  getInstructionsByWorkshopTitle(w_title: string): Observable<Instruction[]> {
    const params = new HttpParams().set('w_title', w_title);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-w`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class instructionsByDepartmentService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';

  getInstructionsByDepartmentTitle(d_title: string, w_title: string): Observable<Instruction[]> {
    const params = new HttpParams().set('d_title', d_title).set('w_title', w_title);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-d`, {params});
  }
}

@Injectable({
  providedIn: 'root'
})
export class instructionsByGroupService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';

  getInstructionsByGroupTitle(g_title: string, d_title: string, w_title: string): Observable<Instruction[]> {
    const params = new HttpParams()
      .set('g_title', g_title)
      .set("d_title", d_title).set("w_title", w_title);
    return this.http.get<Instruction[]>(`${(this.baseApiUrl)}/get-instructions-by-g`, {params});
  }
}

