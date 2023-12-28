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

  onSubmit() {
    console.log('Logging in with:', this.username, this.password); // Debug log
    this.isLoading = true; // Set loading to true
    this.authService.login(this.username, this.password).subscribe(
      success => {
        this.isLoading = false; // Set loading to false
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.isLoading = false; // Set loading to false
        alert('Invalid credentials');
        // Handle the error properly (e.g., showing a message in the UI)
      }
    );
  }
}
