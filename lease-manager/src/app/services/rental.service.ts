import { Injectable } from '@angular/core';
import { Rental } from '../models/rental.model';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  // Dummy data for development
  private rentals: Rental[] = [

    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnD4EDtBkfS3rBPlqJ9UOSr-ksFfhuusrag&usqp=CAU",
      "lotNumber": 1,
      "leaseHolderName": "Jane Smith",
      "paymentStatus": "up-to-date"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqDYPF1Crj7Ke9bXE7la1BNQEGzNgGE_tNRw&usqp=CAU",
      "lotNumber": 2,
      "leaseHolderName": "John Doe",
      "paymentStatus": "less-than-7"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHv10x-Al3TrPeKlfdF9U2bWUecYhz3BT69A&usqp=CAU",
      "lotNumber": 3,
      "leaseHolderName": "Alice Brown",
      "paymentStatus": "over-7"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF799v8MJtR4WQMaPhIn_TlC6lJI-XTcumVQ&usqp=CAU",
      "lotNumber": 4,
      "leaseHolderName": "Robert Smith",
      "paymentStatus": "up-to-date"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhWZ65-wADowbRJgzRy0_w520jUGbd8E9Wlg&usqp=CAU",
      "lotNumber": 5,
      "leaseHolderName": "Emily Johnson",
      "paymentStatus": "less-than-7"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlxWV1WAVSFqxugo9G2z2rqyI4mBchf0yO4Q&usqp=CAU",
      "lotNumber": 6,
      "leaseHolderName": "David White",
      "paymentStatus": "up-to-date"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCnce_d3RWIlxXStQMZR-oDnPWOMihrFVug&usqp=CAU",
      "lotNumber": 7,
      "leaseHolderName": "Sara Parker",
      "paymentStatus": "over-7"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQax3WjM5JGqhJarnFc0ZMiy75cdV43R_rhhg&usqp=CAU",
      "lotNumber": 8,
      "leaseHolderName": "Michael Green",
      "paymentStatus": "up-to-date"
    },
    {
      "imageUrl": "path/to/image9.jpg",
      "lotNumber": 9,
      "leaseHolderName": "Laura Wilson",
      "paymentStatus": "less-than-7"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8_BN6guDHNB9P1tofvXGn3muNWUIethwe8Q&usqp=CAU",
      "lotNumber": 10,
      "leaseHolderName": "Chris King",
      "paymentStatus": "over-7"
    },
    {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLEfb8HyR__bAinSlYYygMz6zAxnPwMf00w&usqp=CAU",
      "lotNumber": 11,
      "leaseHolderName": "Anna Martin",
      "paymentStatus": "up-to-date"
    }


  ];

  getRentals(): Rental[] {
    return this.rentals;
  }

  // Uncomment below when ready to integrate with backend
  // Future API call to fetch rentals
  // fetchRentals(): Observable<Rental[]> {
  //   return this.http.get<Rental[]>(API_URL);
  // }
}
