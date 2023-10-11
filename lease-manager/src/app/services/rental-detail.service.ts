//<!-- rental-detail.service.ts -->
import { Injectable } from '@angular/core';
import { RentalDetail } from '../models/rental-detail.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  // Import the 'of' operator

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  // Commented the API URL for now
  // private baseUrl: string = 'http://api.example.com/rental-details';

  constructor(private http: HttpClient) { }

  updateRentalDetail(detail: RentalDetail): Observable<RentalDetail> {
    // Commenting out actual API call and returning dummy response for now
    // const apiUrl = `${this.baseUrl}/${detail.id}`;
    // return this.http.put<RentalDetail>(apiUrl, detail);

    return of(detail); // Just returning the provided detail
  }

  undoRentalDetailUpdate(detail: RentalDetail): Observable<RentalDetail> {
    // Commenting out actual API call and returning dummy response for now
    // const apiUrl = `${this.baseUrl}/${detail.id}`;
    // return this.http.put<RentalDetail>(apiUrl, detail);

    return of(detail); // Just returning the provided detail
  }

  // Using dummy data instead of an API call for now
  fetchRentals(): Observable<RentalDetail[]> {
    return of(this.dummyData());  // Return the dummy data wrapped as an Observable
    // Commented the API call
    // return this.http.get<RentalDetail[]>(this.baseUrl);
  }

  private dummyData(): RentalDetail[] {
    // Your dummy data remains the same
    return [
      new RentalDetail(1, "John Doe", "123 A Street", "john1@example.com", "1234567891", 1000, new Date(), 5, "path/to/lease1.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI7PkCvGDy0b5COAFrYeOOJN-u3kqzFON57w&usqp=CAU", "up-to-date"),
      new RentalDetail(2, "Jane Smith", "124 B Street", "jane2@example.com", "1234567892", 1100, new Date(), 5, "path/to/lease2.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIHUm7XZggEcWv35nyj0dBj93rf78Az0Oysw&usqp=CAU", "less-than-7"),
      new RentalDetail(3, "Alice Brown", "125 C Street", "alice3@example.com", "1234567893", 1200, new Date(), 5, "path/to/lease3.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROStfKwUJZhh7v2VtJ3w1WiXhpkplTdMqIu739QAf9QGxbBhMF7thqd5b_E1pJ5phE6ug&usqp=CAU", "over-7"),
      new RentalDetail(4, "Robert Smith", "126 D Street", "robert4@example.com", "1234567894", 1300, new Date(), 5, "path/to/lease4.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhWZ65-wADowbRJgzRy0_w520jUGbd8E9Wlg&usqp=CAU", "up-to-date"),
      new RentalDetail(5, "Emily Johnson", "127 E Street", "emily5@example.com", "1234567895", 1400, new Date(), 5, "path/to/lease5.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlCqT7jNtDC_8Kt-0UIs-zOXD_vaoqf5jwrQ&usqp=CAU", "less-than-7"),
      new RentalDetail(6, "David White", "128 F Street", "david6@example.com", "1234567896", 1500, new Date(), 5, "path/to/lease6.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS-IIlKJV2fogM3JyDwOsWuF3R2cOA23dcOg&usqp=CAU", "up-to-date"),
      new RentalDetail(7, "Sara Parker", "129 G Street", "sara7@example.com", "1234567897", 1600, new Date(), 5, "path/to/lease7.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCnce_d3RWIlxXStQMZR-oDnPWOMihrFVug&usqp=CAU", "over-7"),
      new RentalDetail(8, "Michael Green", "130 H Street", "michael8@example.com", "1234567898", 1700, new Date(), 5, "path/to/lease8.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ5k7gAJv6Bdqs1T36e_MAfbc2xo_XB-KGfQ&usqp=CAU", "up-to-date"),
      new RentalDetail(9, "Laura Wilson", "131 I Street", "laura9@example.com", "1234567899", 1800, new Date(), 5, "path/to/lease9.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxZ1-lk64jWxmJ2o6_JM7wArPkGGbvOq74Ag&usqp=CAU", "less-than-7"),
      new RentalDetail(10, "Chris King", "132 J Street", "chris10@example.com", "1234567810", 1900, new Date(), 5, "path/to/lease10.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGKXEnWpWga1-mLAkq88DyV40JphGUWBnHQA&usqp=CAU", "over-7"),
      new RentalDetail(11, "Anna Martin", "133 K Street", "anna11@example.com", "1234567811", 2000, new Date(), 5, "path/to/lease11.pdf", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlxGh4rykDAg4Nd4DrZDI1QzwUmOhGtoXAZQ&usqp=CAU", "up-to-date")
    ];
  }

  getRentalDetailById(id: number): RentalDetail {
    const data = this.dummyData();
    return data.find(rental => rental.lotNumber === id) || new RentalDetail();
  }
}

