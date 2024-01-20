import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;  // Flag for loading state

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // onSubmit is a method typically triggered when a form is submitted.
  onSubmit() {
    // This log statement is for debugging purposes. It logs the username and password.
    // Note: Logging credentials is a security risk and should be avoided in production.
    console.log('Logging in with:', this.username, this.password);

    // isLoading is a boolean flag used to indicate that an asynchronous operation (like a login) is in progress.
    // Setting this to true can be used to show a loading indicator in the UI.
    this.isLoading = true;

    // authService.login is a method that attempts to log in with the provided credentials.
    // It returns an Observable, which is a stream of data that can be subscribed to.
    this.authService.login(this.username, this.password).subscribe({
      // The 'next' function is called if the Observable emits a value - in this case, on successful login.
      next: (success) => {
        // Once logged in successfully, isLoading is set to false to hide the loading indicator.
        this.isLoading = false;

        // If login is successful, navigate to the dashboard route.
        this.router.navigate(['/dashboard']);
      },

      // The 'error' function is called if the Observable emits an error - in this case, on login failure.
      error: (error) => {
        // isLoading is set to false because the login attempt has finished (even though it failed).
        this.isLoading = false;

        // An alert is shown to the user indicating invalid credentials.
        // In a production environment, you would handle this more gracefully.
        alert('Invalid credentials');

        // Additional error handling logic can be implemented here.
        // For example, logging the error or showing a more user-friendly error message in the UI.
      },

      // The 'complete' function is called when the Observable completes.
      // This function is optional and is used if there's a need to perform some final logic 
      // after the Observable has successfully emitted all its values and finished its work.
      complete: () => {
        // Any cleanup or finalization logic can be placed here.
        // For a login Observable, this might not be necessary, but it's useful for other scenarios.
      }
    });
  }

}
