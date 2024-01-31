import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LeaseHolder } from '../models/lease-holder.model'; // Update path as necessary

@Component({
  selector: 'app-lease-holder-form-modal',
  templateUrl: './lease-holder-form-modal.component.html',
  styleUrls: ['./lease-holder-form-modal.component.css']
})
export class LeaseHolderFormModalComponent {
  leaseHolderForm: FormGroup;
  isEditing: boolean;

  constructor(
    public dialogRef: MatDialogRef<LeaseHolderFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaseHolder
  ) {

    this.isEditing = !!data;
    console.log('Is Editing Mode:', this.isEditing);
    this.leaseHolderForm = new FormGroup({
      id: new FormControl(this.isEditing ? data.id : ''),
      lease_holder_first_name: new FormControl('', this.isEditing ? [] : Validators.required),
      lease_holder_last_name: new FormControl('', this.isEditing ? [] : Validators.required),
      lease_holder_address: new FormControl('', this.isEditing ? [] : Validators.required),
      email: new FormControl('', this.isEditing ? [] : Validators.required),
      phone: new FormControl('', this.isEditing ? [] : Validators.required),

    }, { validators: this.isEditing ? this.atLeastOneRequired('lease_holder_first_name', 'lease_holder_last_name', 'lease_holder_address', 'email', 'phone') : [] });
  }

  // Custom validator to check that at least one of the specified fields is filled
  atLeastOneRequired(...fields: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control as FormGroup;
      let isAtLeastOneFilled = fields.some(fieldName => {
        const field = formGroup.get(fieldName);
        return field && field.value;
      });

      // Return null if validation passes, otherwise return an error object
      return isAtLeastOneFilled ? null : { 'atLeastOneRequired': true };
    };
  }

  onSubmit(): void {
    console.log('Attempting to submit form');

    if (this.leaseHolderForm.valid) {
      let formData = this.leaseHolderForm.value;

      // If editing, construct the lot object with only modified fields
      if (this.isEditing) {
        let lotToUpdate: Partial<LeaseHolder> = { id: this.data.id };

        Object.keys(formData).forEach(key => {
          if (formData[key] !== '' && key in this.data) {
            // Use type assertion to satisfy TypeScript's type checking
            (lotToUpdate as any)[key] = formData[key];
          }
        });

        console.log('Updating lot with only modified fields:', lotToUpdate);
        this.dialogRef.close(lotToUpdate);
      } else {
        console.log('Creating new lot:', formData);
        this.dialogRef.close(formData);
      }
    } else {
      console.error('Form is invalid:', this.leaseHolderForm.errors);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
