import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class GetUserByIdService {

  http = inject(HttpClient);

  // baseApiUrl = 'http://localhost:3000/api';
  baseApiUrl = '/api';
  getUserById(id: number): Observable<User> {
    const params = new HttpParams().set('id', id);
    return this.http.get<User>(`${(this.baseApiUrl)}/get-user-by-id`, {params});
  }
}
