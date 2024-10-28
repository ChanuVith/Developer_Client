import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevAdminService {

  private apiUrl = `${environment.baseApiUrl}api/`;

  constructor(private http: HttpClient) { }

  getCompletedSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}DevAdmin/completed-sessions`);
  }

  getFileDownloadLinks(sessionId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}PageFive/download/${sessionId}`);
  }
}
