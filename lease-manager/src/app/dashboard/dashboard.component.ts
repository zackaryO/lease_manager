import { Component, OnInit } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../models/payment.model';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('OnInit called for DashboardComponent');
    this.rentalService.fetchRentals().subscribe(rentals => {
      console.log('Rentals fetched:', rentals);
      if (rentals && Array.isArray(rentals)) {
        this.rentals = rentals;
      }
    }, error => {
      console.error('Error fetching rentals:', error);
    });
  }

  viewDetails(rental: RentalDetail): void {
    console.log('Navigating to details for lot number:', rental.lotNumber);
    this.router.navigate(['/details', rental.lotNumber]);
  }

  makePayment(event: Event, rental: RentalDetail): void {
    event.stopPropagation();
    console.log('Making payment for:', rental);

    const dueDate = this.ensureDate(rental.dueDate);

    const newPayment = new Payment(
      rental.leaseHolderName,
      rental.lotNumber,
      rental.monthlyRentalAmount,
      new Date(),
      dueDate,
      false
    );

    console.log('New payment:', newPayment);
    this.paymentService.recordPayment(newPayment).subscribe(
      (response) => {
        console.log('Payment recorded:', response);
        rental.paymentStatus = 'up-to-date'; // Ensure 'up-to-date' is a valid status in your model
        console.log('Updating rental detail after payment');
        this.rentalService.updateRentalDetail(rental).subscribe(
          updatedRental => {
            console.log('Rental detail updated after payment:', updatedRental);
          },
          error => {
            console.error('Error updating rental detail after payment:', error);
          }
        );
      },
      (error) => {
        console.error('Error recording payment:', error);
      }
    );

    rental['lastPaymentDate'] = new Date();
    console.log('Last payment date updated:', rental['lastPaymentDate']);
  }

  // Custom function to ensure a variable is a Date
  private ensureDate(date: any): Date {
    return date instanceof Date ? date : new Date(date);
  }

  isPaymentRecent(date: Date): boolean {
    console.log('Checking if payment is recent for date:', date);
    return date.getTime() > Date.now() - 86400000; // 86400000ms equals one day
  }

  undoPayment(event: Event, rental: RentalDetail): void {
    event.stopPropagation();
    console.log('Undoing payment for:', rental);

    if (rental['lastPaymentId'] !== undefined) {
      console.log('Calling deletePayment for payment ID:', rental['lastPaymentId']);
      this.paymentService.deletePayment(rental['lastPaymentId']).subscribe(
        () => {
          console.log('Payment reversed successfully');
          rental.paymentStatus = 'over-7'; // Ensure 'overdue' is a valid status in your model
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