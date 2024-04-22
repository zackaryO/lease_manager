import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  providers: [DatePipe],
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  payments: any[] = [];
  filteredPayments: any[] = [];
  selectedPayments: any[] = [];
  selection = new SelectionModel<any>(true, []);
  startDate: string | undefined;
  endDate: string | undefined;
  selectedLeaseholderId: string | undefined;

  constructor(private paymentService: PaymentService, private datePipe: DatePipe, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data;
      this.filteredPayments = data;
      this.getUniqueLeaseholders();
    });
  }

  loadRecord(): void {
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data;
      this.filteredPayments = data;
      this.selectedPayments = []; // Optionally clear selected payments after reload
      this.getUniqueLeaseholders();
    });
  }

  toggleSelection(payment: any) {
    const idx = this.selectedPayments.indexOf(payment.id);
    if (idx > -1) {
      this.selectedPayments.splice(idx, 1);
    } else {
      this.selectedPayments.push(payment.id);
    }
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const start = this.startDate ? new Date(this.startDate) : new Date(0);
      const end = this.endDate ? new Date(this.endDate) : new Date();
      const matchesDate = paymentDate >= start && paymentDate <= end;
      const leaseholderFullName = `${payment.lease_holder_info.lease_holder_first_name} ${payment.lease_holder_info.lease_holder_last_name}`;
      const selectedFullName = this.selectedLeaseholderId ? this.selectedLeaseholderId : "";
      const matchesLeaseholder = !this.selectedLeaseholderId || leaseholderFullName === selectedFullName;

      return matchesDate && matchesLeaseholder;
    });
  }

  getUniqueLeaseholders() {
    const uniqueLeaseholders = new Map();
    for (const payment of this.payments) {
      const info = payment.lease_holder_info;
      // Assuming each leaseholder has a unique combination of first and last name for uniqueness
      const id = `${info.lease_holder_first_name} ${info.lease_holder_last_name}`;
      if (!uniqueLeaseholders.has(id)) {
        uniqueLeaseholders.set(id, info);
      }
    }
    return Array.from(uniqueLeaseholders.values());
  }


  deleteSelected() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this lease?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.deletePayments(this.selectedPayments).subscribe({
          next: () => {
            this.payments = this.payments.filter(p => !this.selectedPayments.includes(p.id));
            this.selectedPayments = []; // Clearing selected payments
            this.loadRecord(); // Reload the data from the server
          },
          error: (error) => this.showErrorDialog(error)
        });
      }
      // If result is false, the user clicked 'Cancel' or closed the dialog, do nothing
    });
  }

  // General method to show error dialog
  private showErrorDialog(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = this.getServerErrorMessage(error);
    }

    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message: errorMessage }
    });
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    // Check if the error response has a status code and error object
    if (error.status && error.error && typeof error.error === 'object') {
      // Initialize an array to hold individual error messages
      const errorMessages = [];

      // Loop through the keys of the error object
      for (const key in error.error) {
        if (error.error.hasOwnProperty(key)) {
          // Extract the error message for each key
          const message = error.error[key];
          if (Array.isArray(message)) {
            // If the message is an array, join its elements into a single string
            errorMessages.push(`${key}: ${message.join(', ')}`);
          } else {
            // If the message is a string, add it as is
            errorMessages.push(`${key}: ${message}`);
          }
        }
      }

      // Join all error messages and prepend with the status text
      return `Error ${error.status} ${error.statusText}: ${errorMessages.join('; ')}`;
    } else {
      // Fallback for other types of errors
      return `Error ${error.status}: ${error.statusText}`;
    }
  }

  formatPaymentDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(dateString, 'MMM dd, yyyy');
    if (formattedDate === null) {
      // Handle the null case, e.g., return an error message or a default date string
      return 'Invalid date'; // Or any default value or action you see fit
    }
    return formattedDate;
  }


  printReport() {
    // window.print();
    // Add a class or directly set styles to hide the navbar
    document.querySelector('app-navbar')?.setAttribute('style', 'display: none;');
    document.querySelector('.actions')?.setAttribute('style', 'display: none;');

    // Trigger the print dialogue
    window.print();

    // Optionally reset styles after printing
    window.setTimeout(() => {
      document.querySelector('app-navbar')?.removeAttribute('style');
      document.querySelector('.actions')?.removeAttribute('style');
    }, 1000); // Delay might need adjustment based on your needs
  }
}
