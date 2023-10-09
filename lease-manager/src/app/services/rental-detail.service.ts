// rental-detail.service.ts
import { Injectable } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';

@Injectable({
  providedIn: 'root'
})
export class RentalDetailService {
  // private baseUrl: string = 'http://api.example.com/rental-details'; // For future API calls

  constructor() { }

  getRentalDetailById(id: number): RentalDetail {
    // Dummy data for 10 lots
    const dummyData: { [key: number]: RentalDetail } = {
      1: new RentalDetail(1, "John Doe", "123 Street Name", "john1@example.com", "1234567891", 1000, new Date(), 5, "path/to/lease/agreement1.pdf"),
      2: new RentalDetail(2, "Jane Smith", "124 Street Name", "jane2@example.com", "1234567892", 1100, new Date(), 5, "path/to/lease/agreement2.pdf"),
      3: new RentalDetail(3, "Joey Copper", "123 Street Name", "joehn1@example.com", "1234567893", 1000, new Date(), 5, "path/to/lease/agreement3.pdf"),
      4: new RentalDetail(4, "Jane Smith", "124 Street Name", "jane2@example.com", "1234567894", 1100, new Date(), 5, "path/to/lease/agreement4.pdf"),
      5: new RentalDetail(5, "John Doe", "123 Street Name", "john1@example.com", "1234567891", 1000, new Date(), 5, "path/to/lease/agreement1.pdf"),
      6: new RentalDetail(6, "Jane Smith", "124 Street Name", "jane2@example.com", "1234567892", 1100, new Date(), 5, "path/to/lease/agreement2.pdf"),
      // ... Similarly, fill in details for lots 3 through 10
    };

    // Return the data based on the ID (lot number)
    return dummyData[id] || new RentalDetail(); // Return an empty RentalDetail object if the ID doesn't match any dummy data
  }
}
