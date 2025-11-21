import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';
import {isProd} from '../helpers/isProd';

@Injectable({
  providedIn: 'root'
})
export class GetUserByIdService {

  http = inject(HttpClient);

  baseApiUrl = isProd ? '/api' : 'http://localhost:3000/api'

  getUserById(id: number): Observable<User> {
    const params = new HttpParams().set('id', id);
    return this.http.get<User>(`${(this.baseApiUrl)}/get-user-by-id`, {params});
  }
}
