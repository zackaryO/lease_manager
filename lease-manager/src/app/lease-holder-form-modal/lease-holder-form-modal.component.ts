import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaseHolder } from '../models/lease-holder.model'; // Update path as necessary

@Component({
  selector: 'app-lease-holder-form-modal',
  templateUrl: './lease-holder-form-modal.component.html',
  styleUrls: ['./lease-holder-form-modal.component.css']
})
export class LeaseHolderFormModalComponent {
  leaseHolderForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LeaseHolderFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaseHolder
  ) {
    this.leaseHolderForm = new FormGroup({
      lease_holder_first_name: new FormControl(data?.lease_holder_first_name || '', Validators.required),
      lease_holder_last_name: new FormControl(data?.lease_holder_last_name || '', Validators.required),
      lease_holder_address: new FormControl(data?.lease_holder_address || '', Validators.required),
      email: new FormControl(data?.email || '', [Validators.required, Validators.email]),
      phone: new FormControl(data?.phone || '', Validators.required)
      // Add other fields as necessary
    });
  }

  onSubmit(): void {
    if (this.leaseHolderForm.valid) {
      this.dialogRef.close(this.leaseHolderForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
