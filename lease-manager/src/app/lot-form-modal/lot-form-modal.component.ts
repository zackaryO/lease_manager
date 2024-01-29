import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lot } from '../models/lot.model'; // Update path as necessary

@Component({
  selector: 'app-lot-form-modal',
  templateUrl: './lot-form-modal.component.html',
  styleUrls: ['./lot-form-modal.component.css']
})
export class LotFormModalComponent {
  lotForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LotFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lot
  ) {
    this.lotForm = new FormGroup({
      lot_number: new FormControl('', Validators.required),
      lot_address: new FormControl('', Validators.required),
      occupied: new FormControl(false, Validators.required)
      // Add other fields as necessary
    });
  }

  onSubmit(): void {
    if (this.lotForm.valid) {
      this.dialogRef.close(this.lotForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}