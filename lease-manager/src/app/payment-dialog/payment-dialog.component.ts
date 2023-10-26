import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})

export class PaymentDialogComponent implements OnInit {
  paymentForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rentalDetailData: RentalDetail,
    private fb: FormBuilder,
    private rentalService: RentalService
  ) { }

  ngOnInit(): void {
    this.initForm();
    console.log(this.rentalDetailData);

    const leaseId = this.rentalDetailData['leaseId'];
    if (leaseId) {
      this.rentalService.getRentalDetailById(leaseId).subscribe(details => {
        this.rentalDetailData = details;
        this.paymentForm.patchValue({
          payment_amount: this.rentalDetailData.monthlyRentalAmount
        });
      }, error => {
        console.error('Failed to fetch rental details:', error);
      });
    }
  }


  initForm() {
    this.paymentForm = this.fb.group({
      lease: [this.rentalDetailData.id || this.rentalDetailData['leaseId'], Validators.required],
      payment_date: [new Date().toISOString().split('T')[0], Validators.required],
      payment_amount: [this.rentalDetailData?.monthlyRentalAmount || '', Validators.required],
      payment_method: ['', Validators.required],
      transaction_id: [''],
      notes: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      this.dialogRef.close(paymentData);
    }
  }
}
