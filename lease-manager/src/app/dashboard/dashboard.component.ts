import { Component, OnInit } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';
import { RentalService } from '../services/rental-detail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rentals: RentalDetail[] = [];

  constructor(private rentalService: RentalService, private router: Router) { }

  ngOnInit(): void {
    this.rentalService.fetchRentals().subscribe(rentals => {
      console.log(rentals); // Logging the returned data
      if (rentals && Array.isArray(rentals)) {
        this.rentals = rentals;
      }
    }, error => {
      const errorMessage = error.message || error;
      console.error('Error fetching rentals:', errorMessage);
    });
  }

  viewDetails(rental: RentalDetail): void {
    this.router.navigate(['/details', rental.lotNumber]);
  }
}
