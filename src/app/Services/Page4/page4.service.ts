import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PageFour } from '../../Models/Page4';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Page4Service {

  private apiUrl = `${environment.baseApiUrl}api/PageFour/upsert`;

  constructor(private http: HttpClient) { }


  upsertPageFour(data: PageFour): Observable<PageFour> {
    return this.http.post<PageFour>(this.apiUrl, data);
  }
}
