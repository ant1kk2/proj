import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Workshop} from '../interfaces/asideData';

@Injectable({
  providedIn: 'root'
})
export class AsideDataService {
  http = inject(HttpClient);

  // baseApiUrl = 'http://localhost:3000/api';
  baseApiUrl = '/api';
  getAsideData() {
    return this.http.get<Workshop[]>(`${this.baseApiUrl}/get-aside-data`);
  }
}
