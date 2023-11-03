// Make sure to replace '../models/lot.model' with the correct path to your Lot model
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
      lease_agreement_path: [null], // Path for the lease agreement file
      lot_image_path: [null] // Path for the lot image file
    });
  }

  private loadUnoccupiedLots(): void {
    this.rentalService.getUnoccupiedLots().subscribe(
      (lots: Lot[]) => {
        this.availableLots = lots;
      },
      (error) => {
        console.error('Error loading unoccupied lots:', error);
      }
    );
  }

  onFileSelected(event: Event, type: 'lease' | 'lot'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    if (type === 'lease') {
      this.selectedLeaseFile = input.files[0];
    } else {
      this.selectedLotImage = input.files[0];
    }
    // Update form control with the file's name (assuming the backend expects the file's name)
    this.leaseForm.patchValue({
      [type === 'lease' ? 'lease_agreement_path' : 'lot_image_path']: input.files[0].name
    });
  }

  handleDrop(event: DragEvent, type: 'lease' | 'lot'): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (type === 'lease') {
        this.selectedLeaseFile = files[0];
      } else {
        this.selectedLotImage = files[0];
      }
      // Update form control with the file's name
      this.leaseForm.patchValue({
        [type === 'lease' ? 'lease_agreement_path' : 'lot_image_path']: files[0].name
      });
    }
  }

  onSubmit(): void {
    if (this.leaseForm.valid) {
      // Prepare the form data to be sent to the backend
      const formData = new FormData();
      Object.entries(this.leaseForm.value).forEach(
        ([key, value]: [string, any]) => {
          formData.append(key, value);
        }
      );

      // Append the files to the form data if they have been selected
      if (this.selectedLeaseFile) {
        formData.append('lease_agreement_file', this.selectedLeaseFile, this.selectedLeaseFile.name);
      }
      if (this.selectedLotImage) {
        formData.append('lot_image_file', this.selectedLotImage, this.selectedLotImage.name);
      }

      // Call the service to send the form data to the backend
      console.log('Form data before sending:', formData);
      this.rentalService.addNewLease(formData).subscribe(
        (response) => {
          console.log('Lease created successfully', response);
          // Additional logic for a successful creation
        },
        (error) => {
          console.error('Error occurred while creating the lease', error);
          // Additional logic for handling errors
        }
      );
    }
  }
}
