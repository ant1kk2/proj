import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Instruction} from '../interfaces/instruction';


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
