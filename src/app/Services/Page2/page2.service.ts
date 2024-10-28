import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Page2Service {

  private apiUrl = `${environment.baseApiUrl}api/PageTwo`;

  constructor(private http: HttpClient) { }

  submitCurrentJobInfo(devData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, devData, { headers });
  }

  // Get current job information by sessionId
  getBySessionId(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${sessionId}`);
  }

  // Patch current job information by sessionId
  patchSessionId(sessionId: number, patchData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json-patch+json' });
    return this.http.patch<any>(`${this.apiUrl}/${sessionId}`, patchData, { headers });
  }
  
}
