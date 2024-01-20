// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { GlobalDefaultService } from '../services/global-default.service';
import { StatusService } from '../services/status.service';

// this Interface is duplicated in the deatils.component.ts file!
interface GlobalSettings {
  due_date: number;
  grace_period: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rentals: RentalDetail[] = [];
  globalSettings: GlobalSettings = { due_date: 0, grace_period: 0 };

  constructor(
    private rentalService: RentalService,
    private paymentService: PaymentService,
    private globalDefaultService: GlobalDefaultService,
    private statusService: StatusService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('OnInit called for DashboardComponent');

    this.rentalService.fetchRentals().subscribe({
      next: rentals => {
        console.log('Rentals fetched:', rentals);
        // Checking if 'rentals' is an array and handling it accordingly
        if (rentals && Array.isArray(rentals)) {
          this.rentals = rentals.map(rental => ({
            ...rental,
            // Converting 'lastPaymentDate' to a Date object, if it exists
            lastPaymentDate: rental.lastPaymentDate ? new Date(rental.lastPaymentDate) : undefined
          }));
          // Evaluate and update payment status for each rental
          this.rentals.forEach(rental => this.evaluateAndUpdatePaymentStatus(rental));
        }
      },
      error: error => {
        // Error handling for the fetchRentals Observable
        console.error('Error fetching rentals:', error);
      }
      // Note: The 'complete' handler is not used here as it is not necessary for this case.
      // 'complete' would be used if you need to perform actions after the Observable has completed emitting.
    });

    this.fetchSettings();
  }

  viewDetails(rental: RentalDetail): void {
    console.log('Navigating to details for lot number:', rental.id);
    this.router.navigate(['/details', rental.id]);
  }

  makePayment(event: Event, rental: RentalDetail): void {
    event.stopPropagation();
    console.log('Making payment for:', rental);
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: { leaseId: rental.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // handle result
    });
  }

  private ensureDate(date: any): Date {
    return date instanceof Date ? date : new Date(date);
  }

  isPaymentRecent(date: Date): boolean {
    console.log('Checking if payment is recent for date:', date);
    return date.getTime() > Date.now() - 86400000;
  }

  undoPayment(event: Event, rental: RentalDetail): void {
    event.stopPropagation();
    console.log('Undoing payment for:', rental);

    if (rental['lastPaymentId'] !== undefined) {
      console.log('Calling deletePayment for payment ID:', rental['lastPaymentId']);
      this.paymentService.deletePayment(rental['lastPaymentId']).subscribe(
        () => {
          console.log('Payment reversed successfully');
          rental.paymentStatus = 'late';
          rental['lastPaymentDate'] = undefined;
        },
        error => {
          console.error('Error reversing payment:', error);
        }
      );
    } else {
      console.error('No payment ID available to undo the payment');
    }
  }

  fetchSettings() {
    this.globalDefaultService.fetchGlobalSettings().subscribe({
      // 'next' is called whenever the Observable emits a value.
      // In this case, it's called when global settings data is successfully fetched.
      next: (settings: GlobalSettings) => {
        // The emitted value (the fetched settings) is assigned to 'this.globalSettings'.
        this.globalSettings = settings;
      },

      // 'error' is called if the Observable encounters an error condition.
      // This could happen if there's a network issue, server error, etc.
      error: error => {
        // Logs the error to the console.
        console.error('Error fetching global settings:', error);
        // This is where you can handle the error appropriately.
        // For example, you could show a user-friendly message or retry the operation.
      }

      // Note: The 'complete' handler is not used here.
      // 'complete' is called when the Observable completes (i.e., emits all its values).
      // For an HTTP request, 'complete' would be called after the response is received.
      // However, for this specific use case, handling the 'complete' notification is not necessary.
    });
  }

  evaluateAndUpdatePaymentStatus(rental: RentalDetail): void {
    if (!rental.lastPaymentDate) {
      rental.paymentStatus = 'up-to-date';
      this.updateRental(rental);
      return;
    }

    // Calculate the due date, which is one month after the last payment date
    let dueDate = new Date(rental.lastPaymentDate);
    dueDate.setMonth(dueDate.getMonth() + 1);

    const today = new Date();
    const daysSinceDueDate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    // Compare days since due date with grace period
    if (daysSinceDueDate > 0) {
      if (daysSinceDueDate <= rental.gracePeriod) {
        rental.paymentStatus = 'late';
      } else {
        rental.paymentStatus = 'delinquent';
      }
    } else {
      rental.paymentStatus = 'up-to-date';
    }

    this.updateRental(rental);
  }


  updateRental(rental: RentalDetail): void {
    this.rentalService.updateRentalDetail(rental).subscribe({
      next: updatedRental => {
        console.log(`Rental ${updatedRental.id} updated successfully`);
      },
      error: error => {
        console.error(`Error updating rental ${rental.id}:`, error);
      }
    });
  }

  getDaysPastDue(date: string | Date): number {
    return this.statusService.getDaysPastDue(date);
  }


}
