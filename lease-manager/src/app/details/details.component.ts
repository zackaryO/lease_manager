// details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { Subscription } from 'rxjs';
import { StatusService } from '../services/status.service';

// Component Decorator: Defines metadata for the component
@Component({
  selector: 'app-details', // Specifies the custom HTML tag to use for this component
  templateUrl: './details.component.html', // Path to the HTML template
  styleUrls: ['./details.component.css'] // Path to the CSS for this component
})
export class DetailsComponent implements OnInit {
  // Properties
  rentalDetail!: RentalDetail; // Stores the details of a rental. '!' indicates that it will be initialized later.
  originalRentalDetail!: RentalDetail; // Stores the original rental details for comparison or rollback.
  private subscriptions = new Subscription(); // A collection to hold all subscriptions to observables.

  // Constructor: Dependency injection of services and modules
  constructor(
    private rentalService: RentalService, // Injects the RentalService to interact with rental data.
    private statusService: StatusService,
    private route: ActivatedRoute // Injects the ActivatedRoute to access route parameters.
  ) { }

  // ngOnInit Lifecycle Hook: Called after Angular has initialized all data-bound properties.
  ngOnInit(): void {
    // Retrieves the 'id' parameter from the current route.
    const id = this.route.snapshot.paramMap.get('id');

    // Check if the 'id' is provided, log an error and return if not.
    if (id === null) {
      console.error('No id provided');
      return;
    }

    // Subscribes to the rentals observable from the service and processes the data received.
    this.subscriptions.add(
      this.rentalService.rentals$.subscribe(rentals => {
        // Find the rental with the matching 'id'.
        const foundRental = rentals.find(rental => rental.id !== undefined && rental.id.toString() === id);
        if (foundRental) {
          // If found, copy its data to the local properties for rendering and backup.
          this.rentalDetail = { ...foundRental };
          this.originalRentalDetail = { ...foundRental };
          console.log('Found Rental:', this.rentalDetail);
        } else {
          console.log('Rental not found for id:', id);
        }
      })
    );

    // Triggers a fetch for the rentals from the server.
    this.rentalService.fetchRentals().subscribe({
      error: err => {
        console.error('Error fetching rentals:', err);
      }
    });

  }

  // ngOnDestroy Lifecycle Hook: Called just before the component is destroyed.
  ngOnDestroy(): void {
    // Unsubscribes from all subscriptions to prevent memory leaks.
    this.subscriptions.unsubscribe();
  }

  // Converts a due date number to a readable date string.
  getFormattedDueDate(dueDate: number): string {
    const currentDate = new Date();
    const dueDateThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), dueDate);
    return dueDateThisMonth.toDateString();
  }

  getDaysPastDue(date: string | Date): number {
    return this.statusService.getDaysPastDue(date); // this service does not return an observable and is synchronous, no need to subscribe.
  }

  // Clears the input field when it loses focus.
  clearInput(event: FocusEvent): void {
    (event.target as HTMLInputElement).value = '';
  }

  // Saves changes made to the rental detail.
  saveChanges(): void {
    if (window.confirm('Are you sure you want to make this change?')) {
      // Creates an object to track changes.
      const updatedFields: Partial<RentalDetail> = {};
      // Compares each field of the rentalDetail with the original to detect changes.
      Object.keys(this.rentalDetail).forEach(key => {
        if (JSON.stringify(this.rentalDetail[key]) !== JSON.stringify(this.originalRentalDetail[key])) {
          updatedFields[key] = this.rentalDetail[key];
        }
      });

      // If there are changes, sends an update request.
      if (Object.keys(updatedFields).length > 0) {
        if (this.rentalDetail.id === undefined) {
          console.error('Rental ID is undefined');
          return;
        }
        this.rentalService.updateRentalDetail(this.rentalDetail).subscribe(response => {
          console.log('Update successful', response);
          // Updates the original data with the new changes.
          this.originalRentalDetail = JSON.parse(JSON.stringify(this.rentalDetail));
        }, error => {
          console.error('Update failed:', error);
        });
      } else {
        console.log('No changes were made.');
      }
    }
  }

  // Undoes changes by resetting rentalDetail to the original state.
  undoChanges(): void {
    this.rentalDetail = JSON.parse(JSON.stringify(this.originalRentalDetail));
    console.log('Changes have been undone');
  }

  onVacate() {
    // Logic to vacate the property (not implemented here).
  }

  onSendReminder() {
    // Logic to send an email reminder (not implemented here).
  }
}


// // details.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { RentalDetail } from '../models/rental-detail.model';
// import { RentalService } from '../services/rental-detail.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-details',
//   templateUrl: './details.component.html',
//   styleUrls: ['./details.component.css']
// })
// export class DetailsComponent implements OnInit {
//   rentalDetail!: RentalDetail;
//   originalRentalDetail!: RentalDetail;
//   private subscriptions = new Subscription();

//   constructor(
//     private rentalService: RentalService,
//     private route: ActivatedRoute
//   ) { }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id'); // Retrieving "id" parameter instead of "lotNumber"

//     if (id === null) {
//       console.error('No id provided'); // Updated error message for id
//       return;
//     }

//     this.subscriptions.add(
//       this.rentalService.rentals$.subscribe(rentals => {
//         const foundRental = rentals.find(rental => rental.id !== undefined && rental.id.toString() === id); // Comparing id to rental.id instead of rental.lotNumber
//         if (foundRental) {
//           this.rentalDetail = { ...foundRental };
//           this.originalRentalDetail = { ...foundRental };

//           console.log('Found Rental:', this.rentalDetail);
//         } else {
//           console.log('Rental not found for id:', id); // Updated log message for id
//         }
//       })
//     );

//     this.rentalService.fetchRentals().subscribe({
//       error: err => {
//         console.error('Error fetching rentals:', err);
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.unsubscribe();
//   }



//   clearInput(event: FocusEvent): void {
//     (event.target as HTMLInputElement).value = '';
//   }
//   saveChanges(): void {
//     if (window.confirm('Are you sure you want to make this change?')) {
//       const updatedFields: Partial<RentalDetail> = {};
//       Object.keys(this.rentalDetail).forEach(key => {
//         if (JSON.stringify(this.rentalDetail[key]) !== JSON.stringify(this.originalRentalDetail[key])) {
//           updatedFields[key] = this.rentalDetail[key];
//         }
//       });

//       if (Object.keys(updatedFields).length > 0) {
//         if (this.rentalDetail.id === undefined) {
//           console.error('Rental ID is undefined');
//           return;
//         }
//         // Proceed with update since we know id is not undefined
//         this.rentalService.updateRentalDetail(this.rentalDetail).subscribe(response => {
//           console.log('Update successful', response);
//           this.originalRentalDetail = JSON.parse(JSON.stringify(this.rentalDetail)); // Update the original detail after a successful update
//         }, error => {
//           console.error('Update failed:', error);
//         });
//       } else {
//         console.log('No changes were made.');
//       }
//     }
//   }

//   undoChanges(): void {
//     this.rentalDetail = JSON.parse(JSON.stringify(this.originalRentalDetail));
//     console.log('Changes have been undone');
//   }

//   onVacate() {
//     // Logic to vacate the property
//   }

//   onSendReminder() {
//     // Logic to send email reminder
//   }
// }
