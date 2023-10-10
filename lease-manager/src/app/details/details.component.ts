// details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';



@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  rentalDetail!: RentalDetail;
  originalRentalDetail!: RentalDetail; // Store the original data for undoing changes

  constructor(
    private rentalService: RentalService,
    private route: ActivatedRoute  // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Fetching the ID from the route
    const id = +this.route.snapshot.paramMap.get('id')!; // The + is used to convert the string to a number
    this.rentalDetail = this.rentalService.getRentalDetailById(id);
    this.originalRentalDetail = { ...this.rentalDetail };
  }

  clearInput(event: FocusEvent): void {
    (event.target as HTMLInputElement).value = '';
  }

  saveChanges(): void {
    if (window.confirm('Are you sure you want to make this change?')) {
      this.rentalService.updateRentalDetail(this.rentalDetail).subscribe(response => {
        console.log('Update successful', response);
        this.originalRentalDetail = { ...this.rentalDetail }; // Update the original data
      }, error => {
        console.error('Update failed:', error);
      });
    }
  }

  undoChanges(): void {
    this.rentalService.undoRentalDetailUpdate(this.originalRentalDetail).subscribe(response => {
      console.log('Undo successful', response);
      this.rentalDetail = { ...this.originalRentalDetail }; // Reset to the original data
    }, error => {
      console.error('Undo failed:', error);
    });
  }


  onVacate() {
    // Logic to vacate the property
  }

  onSendReminder() {
    // Logic to send email reminder
  }
}
