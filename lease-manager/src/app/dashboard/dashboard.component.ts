// dashboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { PaymentService } from '../services/payment.service';
// import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { GlobalDefaultService } from '../services/global-default.service';
import { StatusService } from '../services/status.service';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';


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
  private initialized = false;
  globalSettings: GlobalSettings = { due_date: 0, grace_period: 0 };
  selectedRentalId: number | null = null;


  constructor(
    private rentalService: RentalService,
    private paymentService: PaymentService,
    private globalDefaultService: GlobalDefaultService,
    private statusService: StatusService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchRentals();
    this.fetchSettings(); // Assuming this is another method for fetching initial settings
  }

  fetchRentals(): void {
    this.rentalService.fetchRentals().subscribe({
      next: rentals => {
        this.rentals = rentals.map(rental => ({
          ...rental,
          lastPaymentDate: rental.lastPaymentDate ? new Date(rental.lastPaymentDate) : undefined
        }));
        this.initialized = true;
        this.cdr.detectChanges(); // Try moving detectChanges here if needed
      },
      error: error => console.error('Error fetching rentals:', error),
    });
  }


  refreshData(): void {
    this.fetchRentals(); // Now you can call fetchRentals both on init and when you need to refresh the data
    this.cdr.detectChanges();
  }


  viewDetails(rental: RentalDetail): void {
    this.selectedRentalId = rental.id ?? null; // Provide a fallback to null if undefined
    if (this.selectedRentalId) {
      this.evaluateAndUpdatePaymentStatus(rental)
    }

  }

  openEmailDialog(event: Event, rental: RentalDetail): void {
    event.stopPropagation();
    console.log('Sending Email to:', rental);
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      data: rental
    });

    dialogRef.afterClosed().subscribe(result => {
      // handle result
    });
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

  // private ensureDate(date: any): Date {
  //   return date instanceof Date ? date : new Date(date);
  // }

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

    const dateDue: string | Date = rental.lastPaymentDate;
    const dateString = dateDue instanceof Date ? dateDue.toISOString().split('T')[0] : dateDue;
    const daysSinceDueDate = this.statusService.getDaysPastDue(dateString, rental.dueDate, rental.gracePeriod);
    console.log("days past due", daysSinceDueDate)
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

    console.log("the new status being sent to updateRental", rental)
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This needs to be replaced with something more efficient 
    ////////////////////////////////
    this.updateRental(rental);
  }


  updateRental(rental: RentalDetail): void {
    this.rentalService.updateRentalStatus(rental).subscribe({
      next: updatedRental => {
        console.log(`Rental ${updatedRental.id} updated successfully`);
      },
      error: error => {
        console.error(`Error updating rental ${rental.id}:`, error);
      }
    });
  }

}
