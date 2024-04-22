import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Adjust the import path as necessary

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  users: any[] = [];  // Array to hold user data
  currentUserId: number | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user_type: [null, Validators.required]
    });

    this.currentUserId = this.authService.getCurrentUserId();
    this.loadUsers();  // Load users when the component initializes
  }

  onSubmit(): void {
    console.log('Form submission attempted');
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.loadUsers();  // Reload users after registration
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    } else {
      console.error('Form is invalid', this.registerForm.errors);
    }
  }


  loadUsers(): void {
    this.authService.listUsers().subscribe({
      next: (users) => {
        console.log("Loaded users:", users);  // Add this line to log user data
        this.users = users;
      },
      error: (error) => {
        console.error('Failed to load users', error);
      }
    });
  }

  deleteUser(userId: number): void {
    console.log("Deleting user with ID:", userId);
    if (userId && userId !== this.currentUserId) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Failed to delete user', error);
        }
      });
    } else {
      console.error('Attempted to delete the current user or User ID is undefined');
    }
  }
}
