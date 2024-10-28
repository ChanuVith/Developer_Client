import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageThree } from '../../Models/Page3';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Page3Service {
  

  private apiUrl = `${environment.baseApiUrl}api/PageThree`;

  constructor(private http: HttpClient) { }

  // Method to upsert PageThree data
  upsertPageThree(data: PageThree): Observable<PageThree> {
    return this.http.post<PageThree>(this.apiUrl, data);
  }
}
