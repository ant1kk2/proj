import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {isProd} from '../helpers/isProd';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class GetUserPhoneService {

  http = inject(HttpClient);

  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  getUserPhone(id: number): Observable<string> {
    const params = new HttpParams().set('id', id);
    return this.http.get<string>(`${(this.baseApiUrl)}/get-user-phone`, {params});
  }
}
