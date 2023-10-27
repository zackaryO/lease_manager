// payment-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { PaymentService } from '../services/payment.service'; // Adjust path as necessary

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {
  paymentForm!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rentalDetailData: RentalDetail,
    private fb: FormBuilder,
    private rentalService: RentalService,
    private paymentService: PaymentService,
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
      notes: [''],
      receipt: [null]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log('Payment submitted.');
    if (this.paymentForm.valid) {
      const payment: any = { ...this.paymentForm.value };

      // Map the lease property to leaseId
      payment.leaseId = payment.lease;
      delete payment.lease; // Remove the original lease property

      // Add the selected file to the payment object
      if (this.selectedFile) {
        payment.receipt = this.selectedFile;
      }

      this.paymentService.submitPayment(payment).subscribe(response => {
        console.log('submitPayment');
        console.log('Payment submitted successfully.', response);
        this.dialogRef.close(payment);
      }, error => {
        console.error('Error submitting payment:', error);
      });
    }
    else {
      console.error('Payment form is invalid.');
      let errorFields: string[] = [];
      for (const name in this.paymentForm.controls) {
        if (this.paymentForm.controls[name].invalid) {
          console.error('Form control invalid:', name, this.paymentForm.controls[name].errors);
          errorFields.push(name.replace(/_/g, ' '));
        }
      }
      this.errorMessage = `The following fields are required: ${errorFields.join(', ')}.`;
    }
  }


  handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.paymentForm.patchValue({
        receipt: this.selectedFile
      });
      this.paymentForm.get('receipt')?.updateValueAndValidity();
    }
  }

  preventDefault(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.paymentForm.patchValue({
      receipt: this.selectedFile
    });
    this.paymentForm.get('receipt')?.updateValueAndValidity();
  }
}
