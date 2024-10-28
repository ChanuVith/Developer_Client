import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Page1Service {

  private apiUrl = `${environment.baseApiUrl}api/PageOne`;

  constructor(private http: HttpClient) { }

  registerDeveloper(devData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, devData, { headers });
  }

  getDeveloperByDevId(devId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${devId}`);
  }

  // Method to update developer info via PATCH
  updateDeveloper(devId: number, patchDocument: any): Observable<any> {
    const url = `${this.apiUrl}/${devId}`;
    return this.http.patch<any>(url, patchDocument);
  }

  // Method to get a developer session by session Id (GET)
  getDevSessionById(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/session/${sessionId}`);
  }

}
