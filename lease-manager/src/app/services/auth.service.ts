// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl = 'http://127.0.0.1:8000/api/'
  private baseUrl = 'http://leasemanager-env.us-east-1.elasticbeanstalk.com/api/'

  private logoutUrl = `${this.baseUrl}logout/`; // URL for the logout endpoint
  private authUrl = `${this.baseUrl}token/`; // URL to your Django auth endpoint
  private registerUrl = `${this.baseUrl}users/create/`; // URL for the creating a new user endpoint
  private listUsersUrl = `${this.baseUrl}users/list/`; // URL for the listing all users endpoint



  // Constructor initializes the service.
  // The HttpClient is injected to make HTTP requests.
  constructor(private http: HttpClient) {

  }

  private getHttpOptions() {
    const token = this.getAuthToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }


  // Function to register a new user.
  registerUser(userData: { username: string, email: string, password: string, user_type: number }): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('Error occurred during user registration:', error);
          return throwError(() => new Error('Failed to create a new user'));
        })
      );
  }

  // Function to get a list of all users, available only to admins.
  listUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.listUsersUrl, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('Error occurred during fetching users:', error);
          return throwError(() => new Error('Failed to retrieve user list'));
        })
      );
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

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}user/${userId}/delete/`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('Error occurred during deleting the user:', error);
          return throwError(() => new Error('Failed to delete the user'));
        })
      );
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.user_id; // Make sure the payload has user_id
    }
    return null;
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
  // private checkTokenExpiration(): void {
  //   if (this.isTokenExpired()) {
  //     this.logout(); // Logout if the token has expired.
  //   }
  // }

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
    const sixtyMinutes = 60 * 60 * 1000; // 60 minutes in milliseconds.
    // Check if more than 60 minutes have passed.
    return timeElapsed > sixtyMinutes;
  }
}
