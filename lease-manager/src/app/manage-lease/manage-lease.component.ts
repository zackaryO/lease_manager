// manage-lease.component.ts
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../services/rental-detail.service';
import { Lot } from '../models/lot.model';
import { Lease } from '../models/lease.model';
import { LeaseHolder } from '../models/lease-holder.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LotFormModalComponent } from '../lot-form-modal/lot-form-modal.component';
import { LeaseHolderFormModalComponent } from '../lease-holder-form-modal/lease-holder-form-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { LeaseEditDialogComponent } from '../lease-edit-dialog/lease-edit-dialog.component';

@Component({
  selector: 'app-manage-lease',
  templateUrl: './manage-lease.component.html',
  styleUrls: ['./manage-lease.component.css']
})
export class ManageLeaseComponent implements OnInit {
  leases: Lease[] = [];
  lots: Lot[] = [];
  unoccupiedLots: Lot[] = [];
  leaseHolders: LeaseHolder[] = [];
  leaseForm: FormGroup; // Form for Lease
  lotForm: FormGroup; // Form for Lot
  leaseHolderForm: FormGroup; // Form for LeaseHolder
  selectedLease: Lease | null = null;
  selectedLot: Lot | null = null;
  selectedLeaseHolder: LeaseHolder | null = null;
  isDataLoading: boolean = false;


  constructor(private rentalService: RentalService, private dialog: MatDialog) {
    this.leaseForm = new FormGroup({
      lot: new FormControl('', Validators.required),
      lease_holder: new FormControl('', Validators.required),
      monthly_rental_amount: new FormControl(0, [Validators.required, Validators.min(0)]),
      due_date: new FormControl(1, Validators.required),
      grace_period: new FormControl(5, [Validators.required, Validators.min(0)]),
      lease_agreement_path: new FormControl(null),
      lot_image_path: new FormControl(null),
      payment_status: new FormControl('up-to-date', Validators.required)
    });
    this.lotForm = new FormGroup({
      lot_number: new FormControl('', Validators.required),
      lot_address: new FormControl('', Validators.required),
      occupied: new FormControl(false, Validators.required)
      // Add other fields as necessary
    });
    this.leaseHolderForm = new FormGroup({
      lease_holder_first_name: new FormControl('', Validators.required),
      lease_holder_last_name: new FormControl('', Validators.required),
      lease_holder_address: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      // Add other fields as necessary
    });
  }

  ngOnInit() {
    // this.loadLeases();
    // this.loadLots();
    // this.loadLeaseHolders();
    // this.loadUnoccupiedLots();
    this.refreshAllData();
  }

  refreshAllData(): void {
    this.loadLeases();
    this.loadLots();
    this.loadLeaseHolders();
    this.loadUnoccupiedLots();
    // Any other data refresh operations you need
  }

  private loadLeases() {
    this.isDataLoading = true;

    this.rentalService.fetchLeases().subscribe({
      next: (data) => {
        console.log('Leases data:', data); // Log the received data
        this.leases = data;
        this.isDataLoading = false;
      },
      error: (error) => {
        console.error('Error fetching leases:', error); // Log any error
        this.showErrorDialog(error);
        this.isDataLoading = false;
      },
      complete: () => {
        // Optional: Code to run on completion, if needed
      }
    });
  }

  editLeaseDialog(event: Event, lease: Lease): void {
    event.stopPropagation();
    console.log("Editing lease:", lease);
    const dialogRef = this.dialog.open(LeaseEditDialogComponent, {
      // width: '1000%', // Use a percentage to be responsive
      height: '800',
      // maxWidth: '2000px', // Maximum width to avoid overly wide dialogs on large screens
      autoFocus: false,
      data: {
        lease: lease,
        unoccupiedLots: this.unoccupiedLots,
        leaseHolders: this.leaseHolders,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { // Assuming `true` indicates a successful update
        // Reset the form and refresh all relevant data
        this.leaseForm.reset();
        this.refreshAllData(); // Assuming this method exists and does the refresh
      }
    });

  }

  private loadLots() {
    this.rentalService.getLots().subscribe({
      next: (data) => this.lots = data,
      error: (error) => this.showErrorDialog(error)
    });
  }

  private loadUnoccupiedLots() {
    this.rentalService.getUnoccupiedLots().subscribe({
      next: (data) => this.unoccupiedLots = data,
      error: (error) => this.showErrorDialog(error)
    });
  }

  // Lot CRUD methods
  selectLot(lot: Lot) {
    this.selectedLot = lot;
    this.lotForm.patchValue(lot);
  }

  createLot(lotData: Lot) {
    this.rentalService.addLot(lotData).subscribe({
      next: () => {
        this.loadLots();
        this.loadUnoccupiedLots();
        this.loadLeases();
      },
      error: (error) => this.showErrorDialog(error)
    });
  }

  updateLot(lotData: Lot) {
    this.rentalService.updateLot(lotData).subscribe({
      next: () => {
        this.loadLots();
        this.loadUnoccupiedLots();
        this.loadLeases();
      },
      error: (error) => this.showErrorDialog(error)
    });
  }

  // Add a method to check if a lot is unoccupied
  isLotUnoccupied(lotId: number): boolean {
    return this.unoccupiedLots.some(unoccupiedLot => unoccupiedLot.id === lotId);
  }

  // Modify the deleteLot method
  deleteLot(lot: Lot) {
    if (this.isLotUnoccupied(lot.id)) {
      this.rentalService.deleteLot(lot.id).subscribe({
        next: () => {
          this.loadUnoccupiedLots();
          this.loadLots();
        },
        error: (error) => this.showErrorDialog(error)
      });
    } else {
      alert('Cannot delete this lot as it is currently occupied. Please delete or modify the associated lease first.');
    }
  }

  // LeaseHolder CRUD methods
  selectLeaseHolder(leaseHolder: LeaseHolder) {
    this.selectedLeaseHolder = leaseHolder;
    this.leaseHolderForm.patchValue(leaseHolder);
  }

  private loadLeaseHolders() {
    this.rentalService.fetchLeaseHolders().subscribe({
      next: (data) => {
        this.leaseHolders = data;
      },
      error: (err) => {
        console.error('Error loading lease holders:', err);
        // Handle any errors here, such as showing a notification to the user
      }
    });
  }

  createLeaseHolder(leaseHolderData: LeaseHolder) {
    this.rentalService.addLeaseHolder(leaseHolderData).subscribe(() => {
      this.loadLeaseHolders();
    });
  }

  updateLeaseHolder(leaseHolderData: LeaseHolder) {
    this.rentalService.updateLeaseHolder(leaseHolderData).subscribe(() => {
      this.loadUnoccupiedLots();
      this.loadLeases();
    });
  }

  LeaseHolderActive(LHId: number): boolean {
    console.log('LeaseHolder ID:', LHId);
    return this.leases.some(lease => {
      console.log('Lease holder in lease:', lease.lease_holder);
      return lease.lease_holder === LHId;
    });
  }


  deleteLeaseHolder(leaseHolder: LeaseHolder) {
    if (!this.LeaseHolderActive(leaseHolder.id)) {
      this.rentalService.deleteLeaseHolder(leaseHolder.id).subscribe({
        next: () => {
          this.loadLeases();
          this.loadLeaseHolders();
        },
        error: (error) => this.showErrorDialog(error)
      });
    } else {
      alert('Cannot delete this lease holder is currently associated with a lease. Please delete or modify the associated lease first.');
    }
  }

  selectLease(lease: Lease) {
    this.selectedLease = lease;
    this.leaseForm.patchValue({
      ...lease,

    });
  }

  onFileSelected(event: Event, field: string) {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files?.[0];
    if (file) {
      this.leaseForm.patchValue({ [field]: file });
    }
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent, field: string) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.leaseForm.patchValue({ [field]: files[0] });
    }
  }


  submitForm() {
    if (this.leaseForm.valid) {
      const formData = new FormData();
      Object.keys(this.leaseForm.value).forEach(key => {
        if (key === 'lease_agreement_path' || key === 'lot_image_path') {
          if (this.leaseForm.get(key)?.value) {
            formData.append(key, this.leaseForm.get(key)?.value);
          }
        } else {
          formData.append(key, this.leaseForm.get(key)?.value.toString());
        }
      });

      if (this.selectedLease) {
        console.log('Updating lease with values:', formData);
        // Call the update method in the service
      } else {
        console.log('Creating new lease with values:', formData);
        this.rentalService.addNewLease(formData).subscribe({
          next: () => {
            this.leaseForm.reset();
            this.refreshAllData();
          },
          error: (error) => this.showErrorDialog(error)
        });
      }
    }
  }

  deleteLease(lease: Lease) {
    this.rentalService.deleteLease(lease.id).subscribe({
      next: () => {
        this.loadUnoccupiedLots();
        this.loadLeases();
        this.loadLots();
        this.leaseForm.reset();
      },
      error: (error) => this.showErrorDialog(error)
    });
  }

  cancelEdit() {
    this.selectedLease = null;
    this.leaseForm.reset();
  }


  // Method to open the Lot form in a modal
  openLotFormModal(lot: Lot | null) {
    const dialogRef = this.dialog.open(LotFormModalComponent, {
      width: '250px',
      data: lot // Pass existing lot or null for a new lot
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (lot) {
          this.updateLot(result);
        } else {
          this.createLot(result);
        }
      }
    });
  }

  // Method to open the LeaseHolder form in a modal
  openLeaseHolderFormModal(leaseHolder: LeaseHolder | null) {
    const dialogRef = this.dialog.open(LeaseHolderFormModalComponent, {
      width: '250px',
      data: leaseHolder // Pass existing leaseHolder or null for a new lease holder
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (leaseHolder) {
          this.updateLeaseHolder(result);
        } else {
          this.createLeaseHolder(result);
        }
      }
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



}
