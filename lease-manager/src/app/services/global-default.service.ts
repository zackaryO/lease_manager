// global-default.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class
  GlobalDefaultService {
  private globalSettingsUrl = 'http://leasemanager-env.us-east-1.elasticbeanstalk.com/api/global/'; // URL to your Django global settings endpoint
  // private globalSettingsUrl = 'http://127.0.0.1:8000/api/global/'; // URL to your Django gl

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + authToken });
  }

  fetchGlobalSettings(): Observable<any> {
    return this.http.get<any>(this.globalSettingsUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error fetching global settings', error);
          throw error;
        })
      );
  }

  updateGlobalSettings(settings: any): Observable<any> {
    return this.http.put<any>(this.globalSettingsUrl, settings, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error updating global settings', error);
          throw error;
        })
      );
  }
}