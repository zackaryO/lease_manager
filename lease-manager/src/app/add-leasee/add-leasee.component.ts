// add-leasee.components.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../services/rental-detail.service';
import { Lot } from '../models/lot.model'; // Import the Lot model

@Component({
  selector: 'app-add-leasee',
  templateUrl: './add-leasee.component.html',
  styleUrls: ['./add-leasee.component.css']
})
export class AddLeaseeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedLeaseFile: File | null = null;
  selectedLotImage: File | null = null;
  leaseForm!: FormGroup;
  availableLots: Lot[] = []; // Assuming you have a Lot model defined
  unoccupiedLotsAvailable = true; // Property to track availability of unoccupied lots

  constructor(
    private fb: FormBuilder,
    private rentalService: RentalService // Assuming RentalService is correctly implemented
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUnoccupiedLots();
  }

  private initializeForm(): void {
    this.leaseForm = this.fb.group({
      lease_holder_first_name: ['', Validators.required],
      lease_holder_last_name: ['', Validators.required],
      lease_holder_address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      lot: [null, Validators.required], // Assuming you're selecting a lot by ID
      monthly_rental_amount: [0, Validators.required], // Assuming this is a required field
      due_date: [0, Validators.required], // Assuming this is a required field
      grace_period: [0, Validators.required], // Assuming this is a required field
      payment_status: ['up-to-date'], // Default value set, modify as necessary
      lease_agreement_path: [''], // Path updated after file upload
      lot_image_path: [''] // Path updated after file upload
    });
  }

  private loadUnoccupiedLots(): void {
    this.rentalService.getUnoccupiedLots().subscribe(
      (lots: Lot[]) => {
        this.availableLots = lots;
        this.unoccupiedLotsAvailable = lots.length > 0; // Update the flag based on lots availability
      },
      (error) => {
        console.error('Error loading unoccupied lots:', error);
        this.unoccupiedLotsAvailable = false; // Set flag to false in case of error
      }
    );
  }

  onFileSelected(event: Event, type: 'lease_agreement_file' | 'lot_image_file'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    if (type === 'lease_agreement_file') {
      this.selectedLeaseFile = input.files[0];
    } else if (type === 'lot_image_file') {
      this.selectedLotImage = input.files[0];
    }

    // Update form control logic (if needed)
  }

  handleDrop(event: DragEvent, type: 'lease_agreement_file' | 'lot_image_file'): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (type === 'lease_agreement_file') {
        this.selectedLeaseFile = files[0];
      } else if (type === 'lot_image_file') {
        this.selectedLotImage = files[0];
      }

      // Update form control logic (if needed)
    }
  }

  private logFormErrors(): void {
    Object.keys(this.leaseForm.controls).forEach(key => {
      const controlErrors = this.leaseForm.get(key)?.errors;
      if (controlErrors) {
        console.error(`Validation error in '${key}':`, controlErrors);
      }
    });
  }

  onSubmit(): void {
    if (this.leaseForm.valid) {
      const formData = new FormData();

      Object.entries(this.leaseForm.value).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'string' || value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      if (this.selectedLeaseFile) {
        // Ensure that this field name matches what your backend expects
        formData.append('lease_agreement_path', this.selectedLeaseFile, this.selectedLeaseFile.name);
      }

      if (this.selectedLotImage) {
        // Ensure that this field name matches what your backend expects
        formData.append('lot_image_path', this.selectedLotImage, this.selectedLotImage.name);
      }

      this.rentalService.addNewLease(formData).subscribe(
        response => {
          console.log('Lease created successfully', response);
          // Handle successful response
        },
        error => {
          console.error('Error occurred while creating the lease', error);
          // Handle error response
        }
      );
    } else {
      console.log('Form is not valid. Logging errors:');
      this.logFormErrors();
    }
  }



}
