// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private authUrl = 'http://leasemanage-env.eba-kc4p6z6r.us-east-2.elasticbeanstalk.com/api/token/'; // URL to your Django auth endpoint
  // private logoutUrl = 'http://leasemanage-env.eba-kc4p6z6r.us-east-2.elasticbeanstalk.com/api/logout/'; // URL for the logout endpoint


  private logoutUrl = 'http://127.0.0.1:8000/api/logout/'; // URL for the logout endpoint
  private authUrl = 'http://127.0.0.1:8000/api/token/'; // URL to your Django auth endpoint

  // Constructor initializes the service.
  // The HttpClient is injected to make HTTP requests.
  constructor(private http: HttpClient) {
    // When the service is instantiated, it checks if the token is expired.
    this.checkTokenExpiration();
  }

  // Login function: Takes username and password, returns an Observable.
  login(username: string, password: string): Observable<any> {
    // HTTP POST request to the authentication URL with username and password.
    return this.http.post<any>(this.authUrl, { username, password })
      .pipe(
        // tap operator allows side effects, here used for storing token and login time.
        tap(response => {
          const currentTime = new Date().getTime(); // Current time in milliseconds.
          localStorage.setItem('authToken', response.access); // Store the token in localStorage.
          localStorage.setItem('loginTime', currentTime.toString()); // Store the login time.
        }),
        // catchError handles any errors from the HTTP request.
        catchError(error => {
          console.error('An error occurred', error);
          throw error; // Rethrow the error for further handling.
        })
      );
  }

  // Logout function: Clears the authentication token and login time from localStorage.
  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginTime');
      }),
      catchError(error => {
        console.error('Error during backend logout:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginTime');
        return throwError(error);
      })
    );
  }

  // Function to check if the user is currently logged in.
  isLoggedIn(): boolean {
    // Retrieves the authToken from localStorage.
    const authToken = localStorage.getItem('authToken');
    // If there's no token, the user is not logged in.
    if (!authToken) {
      return false;
    }
    // If the token is expired, return false.
    return !this.isTokenExpired();
  }

  // Function to retrieve the authentication token.
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Private function to check if the stored token has expired.
  private checkTokenExpiration(): void {
    if (this.isTokenExpired()) {
      this.logout(); // Logout if the token has expired.
    }
  }

  // Private helper function to determine if the token is expired.
  private isTokenExpired(): boolean {
    const loginTime = localStorage.getItem('loginTime');
    // If there's no loginTime recorded, consider the token expired.
    if (!loginTime) {
      return true;
    }
    const currentTime = new Date().getTime(); // Current time.
    // Calculate the elapsed time since login.
    const timeElapsed = currentTime - parseInt(loginTime);
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds.
    // Check if more than 30 minutes have passed.
    return timeElapsed > thirtyMinutes;
  }
}
