import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadInstructionService {
  http = inject(HttpClient);

  baseApiUrl = 'http://localhost:3000/api';
  // baseApiUrl = '/api';
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
