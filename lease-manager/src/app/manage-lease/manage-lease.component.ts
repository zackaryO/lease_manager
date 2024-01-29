// manage-lease.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../services/rental-detail.service';
import { Lot } from '../models/lot.model';
import { Lease } from '../models/lease.model';
import { LeaseHolder } from '../models/lease-holder.model';
import { MatDialog } from '@angular/material/dialog';
import { LotFormModalComponent } from '../lot-form-modal/lot-form-modal.component'; // Update the path as necessary
import { LeaseHolderFormModalComponent } from '../lease-holder-form-modal/lease-holder-form-modal.component'; // Update the path as necessary

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
    this.loadLeases();
    this.loadLots();
    this.loadLeaseHolders();
    this.loadUnoccupiedLots();
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
        this.isDataLoading = false;
      },
      complete: () => {
        // Optional: Code to run on completion, if needed
      }
    });
  }

  private loadLots() {
    this.rentalService.getLots().subscribe(data => {
      this.lots = data;
    });
  }

  private loadUnoccupiedLots() {
    this.rentalService.getUnoccupiedLots().subscribe(data => {
      this.unoccupiedLots = data;
    });
  }

  // Lot CRUD methods
  selectLot(lot: Lot) {
    this.selectedLot = lot;
    this.lotForm.patchValue(lot);
  }

  createLot(lotData: Lot) {
    this.rentalService.addLot(lotData).subscribe(() => {
      this.loadLots();
    });
  }

  // createLot() {
  //   if (this.lotForm.valid) {
  //     this.rentalService.addLot(this.lotForm.value).subscribe(() => {
  //       this.loadLots();
  //       this.selectedLot = null;
  //       this.lotForm.reset();
  //     });
  //   }
  // }

  updateLot(lotData: Lot) {
    this.rentalService.updateLot(lotData).subscribe(() => {
      this.loadUnoccupiedLots();
    });
  }

  // updateLot() {
  //   if (this.selectedLot && this.lotForm.valid) {
  //     const updatedLot = { ...this.selectedLot, ...this.lotForm.value };
  //     this.rentalService.updateLot(updatedLot).subscribe(() => {
  //       this.loadUnoccupiedLots();
  //       this.selectedLot = null;
  //       this.lotForm.reset();
  //     });
  //   }
  // }

  deleteLot(lot: Lot) {
    this.rentalService.deleteLot(lot.id).subscribe(() => {
      this.loadUnoccupiedLots();
    });
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

  // createLeaseHolder() {
  //   if (this.leaseHolderForm.valid) {
  //     this.rentalService.addLeaseHolder(this.leaseHolderForm.value).subscribe(() => {
  //       this.loadLeaseHolders();
  //       this.selectedLeaseHolder = null;
  //       this.leaseHolderForm.reset();
  //     });
  //   }
  // }

  // updateLeaseHolder() {
  //   if (this.selectedLeaseHolder && this.leaseHolderForm.valid) {
  //     const updatedLeaseHolder = { ...this.selectedLeaseHolder, ...this.leaseHolderForm.value };
  //     this.rentalService.updateLeaseHolder(updatedLeaseHolder).subscribe(() => {
  //       this.loadUnoccupiedLots();
  //       this.loadLeases();
  //       this.selectedLeaseHolder = null;
  //       this.leaseHolderForm.reset();
  //     });
  //   }
  // }

  updateLeaseHolder(leaseHolderData: LeaseHolder) {
    this.rentalService.updateLeaseHolder(leaseHolderData).subscribe(() => {
      this.loadUnoccupiedLots();
      this.loadLeases();
    });
  }





  deleteLeaseHolder(leaseHolder: LeaseHolder) {
    this.rentalService.deleteLeaseHolder(leaseHolder.id).subscribe(() => {
      this.loadLeases();
    });
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
        this.rentalService.addNewLease(formData).subscribe(() => {
          this.loadLeases();
          this.loadUnoccupiedLots();
          this.loadLots();
          this.leaseForm.reset();
        });
      }
    }
  }

  deleteLease(lease: Lease) {
    this.rentalService.deleteLease(lease.id).subscribe(() => {
      this.loadUnoccupiedLots();
      this.loadLeases();
      this.loadLots();
      this.leaseForm.reset();
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

  // Refactor CRUD methods to accept parameter from modal result







}
