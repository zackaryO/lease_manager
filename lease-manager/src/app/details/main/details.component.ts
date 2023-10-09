// details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { RentalDetail } from '../../models/rental-detail.model';
import { RentalDetailService } from '../../services/rental-detail.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  rentalDetail!: RentalDetail;

  constructor(
    private rentalDetailService: RentalDetailService,
    private route: ActivatedRoute  // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Fetching the ID from the route
    const id = +this.route.snapshot.paramMap.get('id')!; // The + is used to convert the string to a number
    this.rentalDetail = this.rentalDetailService.getRentalDetailById(id);
  }

  onVacate() {
    // Logic to vacate the property
  }

  onSendReminder() {
    // Logic to send email reminder
  }
}
