// dashboard.component.ts
// These are imports from Angular core and other modules, providing functionality and data structures used in this component.
import { Component, OnInit } from '@angular/core'; // Core Angular decorators and lifecycle interfaces.
import { RentalDetail } from '../models/rental-detail.model'; // The model or shape of a rental detail object.
import { RentalService } from '../services/rental-detail.service'; // Service handling rental operations.
import { Router } from '@angular/router'; // Service for navigation between routes.
import { PaymentService } from '../services/payment.service'; // Service handling payment operations.
import { Payment } from '../models/payment.model'; // The model or shape of a payment object.

// @Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'app-dashboard', // The component's CSS element selector.
  templateUrl: './dashboard.component.html', // The location of the component's template file.
  styleUrls: ['./dashboard.component.css'] // The location of the component's private CSS styles.
})
export class DashboardComponent implements OnInit { // The component class, implementing the OnInit interface for lifecycle hook.
  rentals: RentalDetail[] = []; // Property to hold our list of rentals.

  // The constructor sets up the component's services.
  // Services are injected into the constructor - this is dependency injection.
  constructor(
    private rentalService: RentalService, // Injects the rental service.
    private paymentService: PaymentService, // Injects the payment service.
    private router: Router // Injects the router service for navigation.
  ) { }

  // ngOnInit is a lifecycle hook that is called after Angular has initialized all data-bound properties.
  ngOnInit(): void {
    console.log('OnInit called for DashboardComponent');
    // Subscribe to the Observable returned by fetchRentals.
    this.rentalService.fetchRentals().subscribe(rentals => { // Initiates the request to fetch rentals.
      console.log('Rentals fetched:', rentals);
      // Check if rentals is valid and is an array, then assign it to our local rentals property.
      if (rentals && Array.isArray(rentals)) {
        this.rentals = rentals; // Assigns data to the rentals property.
      }
    }, error => {
      console.error('Error fetching rentals:', error); // Logs errors to the console.
    });
  }

  // This method is triggered when a user clicks to view details for a rental.
  viewDetails(rental: RentalDetail): void {
    console.log('Navigating to details for lot number:', rental.id);
    // Uses Angular's router to navigate to the details route with the rental's lotNumber.
    this.router.navigate(['/details', rental.id]);
  }

  // This method is triggered when a user initiates a payment.
  makePayment(event: Event, rental: RentalDetail): void {
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    console.log('Making payment for:', rental);

    // Ensure the date is a Date instance.
    const dueDate = this.ensureDate(rental.dueDate);

    // Creates a new Payment instance.
    const newPayment = new Payment(
      rental.leaseHolderFirstName,
      rental.leaseHolderLastName,
      rental.lotNumber,
      rental.monthlyRentalAmount,
      new Date(), // Current date.
      dueDate,
      false // Initial status for payment - assuming false means unpaid.
    );

    console.log('New payment:', newPayment);
    // Call the recordPayment method from paymentService and subscribe to the Observable it returns.
    this.paymentService.recordPayment(newPayment).subscribe(
      (response) => {
        console.log('Payment recorded:', response);
        // After successful payment, update the rental's payment status.
        rental.paymentStatus = 'up-to-date'; // This status value should be consistent with your data model.
        console.log('Updating rental detail after payment');
        // Update the rental details on the server to reflect the payment.
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

    // Update the local rental data with the last payment date.
    rental['lastPaymentDate'] = new Date();
    console.log('Last payment date updated:', rental['lastPaymentDate']);
  }

  // This method ensures that the input is a valid Date object.
  private ensureDate(date: any): Date {
    // Check if 'date' is already a Date object; if not, convert it.
    return date instanceof Date ? date : new Date(date);
  }

  // This method checks if a payment is recent based on the provided date.
  isPaymentRecent(date: Date): boolean {
    console.log('Checking if payment is recent for date:', date);
    // Check if the payment date is within the last 24 hours (86400000 milliseconds).
    return date.getTime() > Date.now() - 86400000;
  }

  // This method is triggered when a user wants to undo a payment.
  undoPayment(event: Event, rental: RentalDetail): void {
    event.stopPropagation(); // Prevents the event from bubbling up the DOM tree.
    console.log('Undoing payment for:', rental);

    // If the rental has a lastPaymentId, proceed with the undo process.
    if (rental['lastPaymentId'] !== undefined) {
      console.log('Calling deletePayment for payment ID:', rental['lastPaymentId']);
      // Call the deletePayment method from paymentService and subscribe to the Observable it returns.
      this.paymentService.deletePayment(rental['lastPaymentId']).subscribe(
        () => {
          console.log('Payment reversed successfully');
          // Update the rental's status and last payment information.
          rental.paymentStatus = 'over-7'; // This status value should be consistent with your data model. Assuming it indicates overdue.
          rental['lastPaymentDate'] = undefined; // Clear the last payment date.
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
