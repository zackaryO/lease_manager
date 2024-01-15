import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  rentalDetail!: RentalDetail;
  originalRentalDetail!: RentalDetail;
  private subscriptions = new Subscription();

  constructor(
    private rentalService: RentalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      console.error('No id provided');
      return;
    }

    this.subscriptions.add(
      this.rentalService.rentals$.subscribe(rentals => {
        const foundRental = rentals.find(rental => rental.id !== undefined && rental.id.toString() === id);
        if (foundRental) {
          this.rentalDetail = { ...foundRental };
          this.originalRentalDetail = { ...foundRental };

          console.log('Found Rental:', this.rentalDetail);
        } else {
          console.log('Rental not found for id:', id);
        }
      })
    );

    this.rentalService.fetchRentals().subscribe({
      error: err => {
        console.error('Error fetching rentals:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // New function to convert dueDate to a readable date format
  getFormattedDueDate(dueDate: number): string {
    const currentDate = new Date();
    const dueDateThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), dueDate);
    return dueDateThisMonth.toDateString();
  }

  // New function to calculate days past due
  getDaysPastDue(dateString: string | Date): number {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 0;
    }

    const today = new Date();
    const difference = today.getTime() - date.getTime();
    const daysPastDue = Math.ceil(difference / (1000 * 3600 * 24));

    // Adjust logic as per your requirements
    return daysPastDue > 30 ? daysPastDue - 30 : 0;
  }

  clearInput(event: FocusEvent): void {
    (event.target as HTMLInputElement).value = '';
  }

  saveChanges(): void {
    if (window.confirm('Are you sure you want to make this change?')) {
      const updatedFields: Partial<RentalDetail> = {};
      Object.keys(this.rentalDetail).forEach(key => {
        if (JSON.stringify(this.rentalDetail[key]) !== JSON.stringify(this.originalRentalDetail[key])) {
          updatedFields[key] = this.rentalDetail[key];
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        if (this.rentalDetail.id === undefined) {
          console.error('Rental ID is undefined');
          return;
        }
        this.rentalService.updateRentalDetail(this.rentalDetail).subscribe(response => {
          console.log('Update successful', response);
          this.originalRentalDetail = JSON.parse(JSON.stringify(this.rentalDetail));
        }, error => {
          console.error('Update failed:', error);
        });
      } else {
        console.log('No changes were made.');
      }
    }
  }

  undoChanges(): void {
    this.rentalDetail = JSON.parse(JSON.stringify(this.originalRentalDetail));
    console.log('Changes have been undone');
  }

  onVacate() {
    // Logic to vacate the property
  }

  onSendReminder() {
    // Logic to send email reminder
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
