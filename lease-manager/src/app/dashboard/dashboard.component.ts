import { Component, OnInit } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rentals: RentalDetail[] = [];

  constructor(
    private rentalService: RentalService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('OnInit called for DashboardComponent');
    this.rentalService.fetchRentals().subscribe(rentals => {
      console.log('Rentals fetched:', rentals);
      if (rentals && Array.isArray(rentals)) {
        this.rentals = rentals.map(rental => ({
          ...rental,
          lastPaymentDate: rental.lastPaymentDate ? new Date(rental.lastPaymentDate) : undefined
        }));
      }
    }, error => {
      console.error('Error fetching rentals:', error);
    });
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
}
