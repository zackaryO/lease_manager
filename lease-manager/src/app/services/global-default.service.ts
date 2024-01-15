import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class
  GlobalDefaultService {
  private globalSettingsUrl = 'http://127.0.0.1:8000/global/'; // URL to your Django global settings endpoint

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