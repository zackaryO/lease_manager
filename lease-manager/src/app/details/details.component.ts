import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  rentalDetail!: RentalDetail;
  originalRentalDetail!: RentalDetail;

  constructor(
    private rentalService: RentalService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.rentalService.getRentalDetailById(id).subscribe(
      (data: RentalDetail) => {
        this.rentalDetail = data;
        this.originalRentalDetail = JSON.parse(JSON.stringify(data)); // Deep copy for original detail
      },
      (error: any) => {
        console.error('Error fetching rental details:', error);
      }
    );
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
