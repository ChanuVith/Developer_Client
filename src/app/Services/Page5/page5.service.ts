import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Page5Service {

  private apiUrl = `${environment.baseApiUrl}api/PageFive`;

  constructor(private http: HttpClient) { }

  // Method to upload PageFive data
  uploadPageFive(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
}
