// navbar.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GlobalDefault } from '../models/global-default.model';
import { GlobalSettingsModalComponent } from '../global-settings-modal/global-settings-modal.component'; // Adjust path
import { ComponentCanDeactivate } from '../unsaved-changes.guard';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddLeaseeComponent } from '../add-leasee/add-leasee.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, ComponentCanDeactivate {
  globalDefault: GlobalDefault = new GlobalDefault();
  updatedGlobalDefault: GlobalDefault = new GlobalDefault();
  daysInMonth: number[] = [];
  menuActive = false;

  constructor(
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fillDaysInMonth();
  }

  canDeactivate(): boolean | Observable<boolean> {
    return JSON.stringify(this.globalDefault) === JSON.stringify(this.updatedGlobalDefault);
  }

  onDueDayChange(newDueDay: number): void {
    this.globalDefault.dueDay = newDueDay;
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
    console.log('Menu toggled, menuActive:', this.menuActive); // log for debugging
    this.cdr.detectChanges(); // manually trigger change detection
  }

  fillDaysInMonth(): void {
    for (let i = 1; i <= 31; i++) {
      this.daysInMonth.push(i);
    }
  }
  openAddLeaseDialog(): void {
    const dialogRef = this.dialog.open(AddLeaseeComponent, {
      width: '250px', // or any other size
      // Pass data to dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // You can refresh data or handle the result here
    });
  }

  openGlobalSettingsModal() {
    if (this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(GlobalSettingsModalComponent, {
        width: '250px' // You can set the width or other properties as needed
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // You can handle any actions after the modal is closed
      });
    } else {
      // Redirect to login
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: error => {
        console.error('Logout failed', error);
        // Handle error or still navigate to login
        this.router.navigate(['/login']);
      }
    });
  }
}
