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
    const id = +this.route.snapshot.paramMap.get('id')!; // the "+" is a shortcut to convert the string to a number

    // If the rentals are already fetched, this subscription will immediately receive them.
    // If the rentals are not yet fetched, this will wait until they are.
    this.subscriptions.add(
      this.rentalService.rentals$.subscribe(rentals => {
        const foundRental = rentals.find(rental => rental.lotNumber === id);
        if (foundRental) {
          this.rentalDetail = { ...foundRental }; // Using spread to get a copy of found rental.
          this.originalRentalDetail = { ...foundRental }; // Storing the original data to be used later if needed.
        } else {
          // Handle the case when the rental is not found, e.g., redirecting to a 'Not Found' page or showing a message.
        }
      })
    );

    // Ensure to fetch the rentals if they haven't been already.
    // The component will receive the rentals via the rentals$ subscription when they arrive.
    this.rentalService.fetchRentals().subscribe({
      error: err => {
        // Handle errors of fetchRentals here.
      }
    });
  }

  ngOnDestroy(): void {
    // Prevent memory leaks by unsubscribing from all subscriptions when the component is destroyed.
    this.subscriptions.unsubscribe();
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
        // Assuming updateRentalDetail takes an id and a Partial<RentalDetail>
        // // this.rentalService.updateRentalDetail(this.rentalDetail.id, updatedFields).subscribe(response => {
        //   console.log('Update successful', response);
        //   this.originalRentalDetail = JSON.parse(JSON.stringify(this.rentalDetail)); // Update the original detail after a successful update
        // }, error => {
        //   console.error('Update failed:', error);
        // });
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
