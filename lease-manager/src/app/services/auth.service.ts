import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://127.0.0.1:8000/api/token/'; // URL to your Django auth endpoint

  constructor(private http: HttpClient) {
    this.checkTokenExpiration();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { username, password })
      .pipe(
        tap(response => {
          const currentTime = new Date().getTime();
          localStorage.setItem('authToken', response.access); // Store token
          localStorage.setItem('loginTime', currentTime.toString()); // Store login time
        }),
        catchError(error => {
          console.error('An error occurred', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');
  }

  isLoggedIn(): boolean {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return false;
    }
    return !this.isTokenExpired();
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private checkTokenExpiration(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  private isTokenExpired(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) {
      return true;
    }
    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - parseInt(loginTime);
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    return timeElapsed > thirtyMinutes;
  }
}
