// details.component.ts
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
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
export class DetailsComponent implements OnChanges {
  @Input() rentalId: number | null = null;
  @Output() updateEvent = new EventEmitter<boolean>();
  rentalDetail!: RentalDetail;
  originalRentalDetail!: RentalDetail;
  private subscriptions = new Subscription();

  // Constructor: Dependency injection of services and modules
  constructor(
    private rentalService: RentalService, // Injects the RentalService to interact with rental data.
    private statusService: StatusService,
    // private route: ActivatedRoute // Injects the ActivatedRoute to access route parameters.
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in input properties
    if (changes['rentalId'] && this.rentalId !== null) {
      // If rentalId changes and is not null, load the relevant rental details
      this.loadRentalDetail(this.rentalId);
    }
  }

  loadRentalDetail(id: number): void {
    // Fetch rental details based on id
    this.subscriptions.add(
      this.rentalService.rentals$.subscribe(rentals => {
        // Subscribe to the observable of rentals
        const foundRental = rentals.find(rental => rental.id === id);
        if (foundRental) {
          // If the rental is found, set it as the current and original detail
          this.rentalDetail = { ...foundRental };
          this.originalRentalDetail = { ...foundRental };
        } else {
          console.error('Rental not found for id:', id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up by unsubscribing to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  // Converts a due date number to a readable date string.
  getFormattedDueDate(dueDate: number): string {
    const currentDate = new Date();
    const dueDateThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), dueDate);
    return dueDateThisMonth.toDateString();
  }

  getDaysPastDue(date: string | Date, dueDay: number, gracePeriod: number): number {
    // Ensure the date is in string format
    const dateString = date instanceof Date ? date.toISOString().split('T')[0] : date;
    // Pass the dateString to the service method
    return this.statusService.getDaysPastDue(dateString, dueDay, gracePeriod);
  }


  // Clears the input field when it loses focus.
  clearInput(event: FocusEvent): void {
    (event.target as HTMLInputElement).value = '';
  }

  // Saves changes made to the rental detail.
  saveChanges(): void {
    // if (window.confirm('Are you sure you want to make this change?')) {
    //   const updatedFields: Partial<RentalDetail> = {};
    //   Object.keys(this.rentalDetail).forEach(key => {
    //     if (JSON.stringify(this.rentalDetail[key]) !== JSON.stringify(this.originalRentalDetail[key])) {
    //       updatedFields[key] = this.rentalDetail[key];
    //     }
    //   });

    //   if (Object.keys(updatedFields).length > 0) {
    //     if (this.rentalDetail.id === undefined) {
    //       console.error('Rental ID is undefined');
    //       return;
    //     }
    //     this.rentalService.updateRentalDetail(this.rentalDetail).subscribe(response => {
    //       console.log('Update successful', response);
    //       this.updateEvent.emit(true);
    //       // Check if rentalDetail.id is defined before calling loadRentalDetail
    //       if (this.rentalDetail.id !== undefined) {
    //         this.loadRentalDetail(this.rentalDetail.id);
    //       }
    //     }, error => {
    //       console.error('Update failed:', error);
    //     });
    //   } else {
    //     console.log('No changes were made.');
    //   }
    // }
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

