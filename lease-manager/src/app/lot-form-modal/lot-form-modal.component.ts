import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lot } from '../models/lot.model'; // Update path as necessary

@Component({
  selector: 'app-lot-form-modal',
  templateUrl: './lot-form-modal.component.html',
  styleUrls: ['./lot-form-modal.component.css']
})
export class LotFormModalComponent {
  lotForm: FormGroup;
  isEditing: boolean;

  constructor(
    public dialogRef: MatDialogRef<LotFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lot
  ) {
    // Determine if the modal is used for editing an existing lot
    this.isEditing = !!data;
    console.log('Is Editing Mode:', this.isEditing);

    // Initialize the form group with controls for lot number, address, and occupied status
    this.lotForm = new FormGroup({
      id: new FormControl(this.isEditing ? data.id : ''),
      lot_number: new FormControl('', this.isEditing ? [] : Validators.required),
      lot_address: new FormControl('', this.isEditing ? [] : Validators.required),
      occupied: new FormControl(this.isEditing ? data.occupied : false)
    }, { validators: this.isEditing ? this.atLeastOneRequired('lot_number', 'lot_address', 'occupied') : [] });

    // Log the initial state of the form
    console.log('Initial Form State:', this.lotForm.value);
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

    if (this.lotForm.valid) {
      let formData = this.lotForm.value;

      if (this.isEditing) {
        let lotToUpdate: Partial<Lot> = { id: this.data.id };

        (Object.keys(formData) as Array<keyof Lot>).forEach(key => {
          if (formData[key] !== '' && formData[key] !== this.data[key]) {
            lotToUpdate[key] = formData[key];
          }
        });

        console.log('Updating lot with modified fields:', lotToUpdate);
        this.dialogRef.close(lotToUpdate);
      } else {
        console.log('Creating new lot:', formData);
        this.dialogRef.close(formData);
      }
    } else {
      console.error('Form is invalid:', this.lotForm.errors);
    }
  }


  onCancel(): void {
    console.log('Form cancelled');
    this.dialogRef.close();
  }
}
