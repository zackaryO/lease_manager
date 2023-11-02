import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../services/rental-detail.service';

@Component({
  selector: 'app-add-leasee',
  templateUrl: './add-leasee.component.html',
  styleUrls: ['./add-leasee.component.css']
})
export class AddLeaseeComponent implements OnInit {

  leaseForm!: FormGroup; // Use the non-null assertion operator
  lots: any[] = []; // If you don't have a model, use any

  constructor(
    private fb: FormBuilder,
    private rentalService: RentalService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadLots();
  }

  private initializeForm(): void {
    this.leaseForm = this.fb.group({
      // ... your form controls
    });
  }

  private loadLots(): void {
    // Assuming getLots is a method in RentalService that needs to be added
    this.rentalService.getLots().subscribe(
      (data: any[]) => { // Replace any with your Lot type if you have one
        this.lots = data;
      },
      (error: any) => { // Explicitly declaring error as any
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.leaseForm.valid) {
      // Call your service here to send the data to the backend
      this.rentalService.addNewLease(this.leaseForm.value).subscribe(
        (response) => {
          console.log(response);
          // Handle success
        },
        (error: any) => { // Again, explicitly declaring error as any
          console.error(error);
          // Handle error
        }
      );
    }
  }
}
