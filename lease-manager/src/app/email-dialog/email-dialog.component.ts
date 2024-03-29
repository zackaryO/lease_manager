// email-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface RentalDetail {
  email: string;
  leaseHolderFirstName: string;
  leaseHolderLastName: string;
  monthlyRentalAmount: number;
  dueDate: number;
}

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.css']
})
export class EmailDialogComponent implements OnInit {
  emailForm!: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rentalDetail: RentalDetail,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const defaultSubject = `Rental Payment Reminder`;

    // First, format the due date using the getFormattedDueDate method
    const formattedDueDate = this.getFormattedDueDate(this.rentalDetail.dueDate);

    // Now, use formattedDueDate in your message
    const defaultMessage = `Hello ${this.rentalDetail.leaseHolderFirstName} ${this.rentalDetail.leaseHolderLastName},
    \nJust a friendly reminder that your rental payment of $${this.rentalDetail.monthlyRentalAmount} is due on ${formattedDueDate}.
    \nIf you have any questions or if there's anything we can help you with, please don't hesitate to get in touch.
    \nThank you!
    \nBest wishes,`;

    this.emailForm = this.fb.group({
      to: [this.rentalDetail.email, [Validators.required, Validators.email]],
      subject: [defaultSubject, Validators.required],
      message: [defaultMessage, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const { to, subject, message } = this.emailForm.value;
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    this.dialogRef.close();
  }

  getFormattedDueDate(dueDate: number): string {
    const currentDate = new Date();
    const dueDateThisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), dueDate);
    return dueDateThisMonth.toDateString();
  }
}
