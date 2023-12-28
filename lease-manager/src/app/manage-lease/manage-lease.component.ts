import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../services/rental-detail.service';
import { Lot } from '../models/lot.model';
import { Lease } from '../models/lease.model';
import { LeaseHolder } from '../models/lease-holder.model';

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

  constructor(private rentalService: RentalService) {
    this.leaseForm = new FormGroup({
      lot: new FormControl('', Validators.required),
      leaseHolder: new FormControl('', Validators.required),
      monthlyRentalAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
      dueDate: new FormControl('', Validators.required),
      gracePeriod: new FormControl(0, [Validators.required, Validators.min(0)]),
      paymentStatus: new FormControl('', Validators.required)
    });
    this.leaseHolderForm = new FormGroup({
      lot_number: new FormControl('', Validators.required),
      lot_address: new FormControl('', Validators.required),
      occupied: new FormControl(false, Validators.required)
      // Add other fields as necessary
    });
    this.lotForm = new FormGroup({
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
    this.loadLots(); // Make sure this method exists and is correctly implemented
    this.loadLeaseHolders(); // Make sure this method exists and is correctly implemented
  }

  private loadLeases() {
    this.isDataLoading = true;
    this.rentalService.fetchLeases().subscribe(data => {
      this.leases = data;
      this.isDataLoading = false;
    }, error => {
      // Handle error
      this.isDataLoading = false;
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

  createLot() {
    if (this.lotForm.valid) {
      this.rentalService.addLot(this.lotForm.value).subscribe(() => {
        this.loadLots();
        this.selectedLot = null;
        this.lotForm.reset();
      });
    }
  }

  updateLot() {
    if (this.selectedLot && this.lotForm.valid) {
      const updatedLot = { ...this.selectedLot, ...this.lotForm.value };
      this.rentalService.updateLot(updatedLot).subscribe(() => {
        this.loadLots();
        this.selectedLot = null;
        this.lotForm.reset();
      });
    }
  }

  deleteLot(lot: Lot) {
    this.rentalService.deleteLot(lot.id).subscribe(() => {
      this.loadLots();
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


  createLeaseHolder() {
    if (this.leaseHolderForm.valid) {
      this.rentalService.addLeaseHolder(this.leaseHolderForm.value).subscribe(() => {
        this.loadLeaseHolders();
        this.selectedLeaseHolder = null;
        this.leaseHolderForm.reset();
      });
    }
  }

  updateLeaseHolder() {
    if (this.selectedLeaseHolder && this.leaseHolderForm.valid) {
      const updatedLeaseHolder = { ...this.selectedLeaseHolder, ...this.leaseHolderForm.value };
      this.rentalService.updateLeaseHolder(updatedLeaseHolder).subscribe(() => {
        this.loadLeaseHolders();
        this.selectedLeaseHolder = null;
        this.leaseHolderForm.reset();
      });
    }
  }

  deleteLeaseHolder(leaseHolder: LeaseHolder) {
    this.rentalService.deleteLeaseHolder(leaseHolder.id).subscribe(() => {
      this.loadLeaseHolders();
    });
  }

  selectLease(lease: Lease) {
    this.selectedLease = lease;
    this.leaseForm.patchValue({
      ...lease,
      lot: lease.lot.id,
      leaseHolder: lease.lease_holder.id
    });
  }

  submitForm() {
    if (this.leaseForm.valid) {
      if (this.selectedLease) {
        // Update the lease
        const updatedLease = { ...this.selectedLease, ...this.leaseForm.value };
        this.rentalService.updateLease(updatedLease).subscribe(() => {
          this.loadLeases();
          this.selectedLease = null;
        });
      } else {
        // Create a new lease
        this.rentalService.addLease(this.leaseForm.value).subscribe(() => {
          this.loadLeases();
        });
      }
    }
  }

  createLease() {
    if (this.unoccupiedLots.length > 0 && this.leaseHolders.length > 0) {
      this.selectedLease = null;
      this.leaseForm.reset();
    } else {
      // Handle case where either unoccupied lots or leaseholders are not available
    }
  }

  deleteLease(lease: Lease) {
    this.rentalService.deleteLease(lease.id).subscribe(() => {
      this.loadLeases(); // Reload leases to update the list
    });
  }

  cancelEdit() {
    this.selectedLease = null;
    this.leaseForm.reset();
  }
}
