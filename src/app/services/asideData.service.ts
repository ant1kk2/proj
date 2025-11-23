import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Workshop} from '../interfaces/asideData';
import {isProd} from '../helpers/isProd';

@Injectable({
  providedIn: 'root'
})
export class AsideDataService {
  http = inject(HttpClient);
  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  getAsideData() {
    return this.http.get<Workshop[]>(`${this.baseApiUrl}/get-aside-data`);
  }
}
