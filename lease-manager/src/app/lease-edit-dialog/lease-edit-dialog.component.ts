import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../services/rental-detail.service';
import { LeaseHolder } from '../models/lease-holder.model';

@Component({
  selector: 'app-lease-edit-dialog',
  templateUrl: './lease-edit-dialog.component.html',
  styleUrls: ['./lease-edit-dialog.component.css']
})
export class LeaseEditDialogComponent implements OnInit {
  leaseEditForm!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string | null = null;


  constructor(
    public dialogRef: MatDialogRef<LeaseEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private rentalService: RentalService,

  ) {
    console.log('Lease to edit:', data.lease);
    console.log('Available lots:', data.unoccupiedLots);
    console.log('Lease holders:', data.leaseHolders);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.leaseEditForm = this.fb.group({
      lot: new FormControl(this.data.lease.lot),
      lease_holder: new FormControl(this.data.lease.lease_holder),
      monthly_rental_amount: new FormControl(this.data.lease.monthly_rental_amount),
      lease_agreement_path: new FormControl(null),
      lot_image_path: new FormControl(null),
    })
  }

  onFileSelected(event: Event, field: string) {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.[0];
    if (file) {
      this.leaseEditForm.patchValue({ [field]: file });
    }
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent, field: string) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.leaseEditForm.patchValue({ [field]: files[0] });
    }
  }

  onSubmit() {
    if (this.leaseEditForm.valid) {
      const formData = new FormData();

      // Safely append non-file fields to FormData, ensuring no null value is turned to string directly
      const lotValue = this.leaseEditForm.get('lot')?.value;
      const leaseHolderValue = this.leaseEditForm.get('lease_holder')?.value;
      const monthlyRentalAmountValue = this.leaseEditForm.get('monthly_rental_amount')?.value;

      // Append values if they are not null, otherwise append an empty string
      formData.append('lot', lotValue != null ? lotValue.toString() : '');
      formData.append('lease_holder', leaseHolderValue != null ? leaseHolderValue.toString() : '');
      formData.append('monthly_rental_amount', monthlyRentalAmountValue != null ? monthlyRentalAmountValue.toString() : '');

      // Append file fields to FormData if they exist
      if (this.leaseEditForm.get('lease_agreement_path')?.value) {
        formData.append('lease_agreement_path', this.leaseEditForm.get('lease_agreement_path')?.value);
      }
      if (this.leaseEditForm.get('lot_image_path')?.value) {
        formData.append('lot_image_path', this.leaseEditForm.get('lot_image_path')?.value);
      }

      // Log the lease ID for debugging
      console.log("Lease ID being updated:", this.data.lease.id);

      // Send FormData to your service
      this.rentalService.updateRentalDetail(formData, this.data.lease.id).subscribe({
        next: () => {
          this.dialogRef.close(true); // Indicate successful update
          console.log("Update successful");
        },
        error: (err) => {
          console.error("Failed to update lease:", err);
          this.errorMessage = "Update failed. Please try again.";
        }
      });
    }
  }


  // onSubmit() {
  //   if (this.leaseEditForm.valid) {
  //     console.log("Form data before processing:", this.leaseEditForm.value);
  //     // Start with a copy of the original lease data
  //     const updatedLeaseData: any = { ...this.data.lease };

  //     // Flag to track if any changes were made
  //     let changesMade = false;

  //     // Determine changes and apply them to the updatedLeaseData
  //     Object.keys(this.leaseEditForm.value).forEach(key => {
  //       const formValue = this.leaseEditForm.value[key];
  //       const originalValue = this.data.lease[key];

  //       // Check if the form value is different from the original value and not null
  //       if (formValue !== originalValue && formValue !== null) {
  //         updatedLeaseData[key] = formValue;
  //         changesMade = true; // Mark that a change was detected
  //       }
  //     });

  //     // Remove the 'lot' field from updatedLeaseData as it's not valid for the server
  //     // delete updatedLeaseData.lot;
  // delete updatedLeaseData.last_payment_date;
  // delete updatedLeaseData.last_payment_date_id;
  // delete updatedLeaseData.lease_holder_address;
  // delete updatedLeaseData.lot_address;
  // delete updatedLeaseData.due_date;
  // delete updatedLeaseData.grace_period;
  // delete updatedLeaseData.payment_status;
  // delete updatedLeaseData.lease_holder_first_name;
  // delete updatedLeaseData.lease_holder_last_name;
  // delete updatedLeaseData.phone;
  // delete updatedLeaseData.email;
  //     // delete updatedLeaseData.lease_agreement_path;
  //     // delete updatedLeaseData.lot_image_path;



  //     // Proceed only if changes were made
  //     if (changesMade) {
  //       console.log("Updated lease data with changes (excluding 'lot'):", updatedLeaseData);

  //       // Use updatedLeaseData for the update operation
  //       this.rentalService.updateRentalDetail(updatedLeaseData).subscribe({
  //         next: () => {
  //           this.dialogRef.close(true); // Indicate successful update
  //         },
  //         error: (err) => {
  //           console.error("Failed to update lease:", err);
  //           this.errorMessage = "Update failed. Please try again.";
  //         }
  //       });
  //     } else {
  //       console.log('No changes were made.');
  //     }
  //   }
  // }



  onCancel(): void {
    this.dialogRef.close();
  }

}