import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // change to true for dev, to gain access to the dashboard page
  private isAuthenticated = true;

  constructor() { }

  // this will be modified to first see if username exists (after both password and username fields are populated, if the user exists, 
  // the API will return the salt and concatinate with the password, send the password and authenticate)
  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'password') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
