import { Component, OnInit } from '@angular/core';
import { Rental } from '../../models/rental.model';
import { RentalService } from '../../services/rental.service';
import { Router } from '@angular/router';  // Step 1: Import Router

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rentals: Rental[] = [];

  constructor(private rentalService: RentalService, private router: Router) { }

  ngOnInit(): void {
    this.rentals = this.rentalService.getRentals();
  }

  viewDetails(rental: Rental): void {
    // Use the router to navigate to the details page with the rental's lotNumber
    this.router.navigate(['/details', rental.lotNumber]);
  }
}

