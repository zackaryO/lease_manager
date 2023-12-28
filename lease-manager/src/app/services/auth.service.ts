import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private authToken: string | null = null;
  private authUrl = 'http://127.0.0.1:8000/api/token/'; // URL to your Django auth endpoint

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { username, password })
      .pipe(
        tap(response => {
          this.isAuthenticated = true;
          this.authToken = response.access; // Adjust this based on your API response
          // Only store the token if it's not null
          if (this.authToken) {
            localStorage.setItem('authToken', this.authToken);
          }
        }),
        catchError(error => {
          console.error('An error occurred', error);
          throw error;
        })
      );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

}
