// rental-detail.service.ts
// This line imports the Injectable decorator from Angular core. 
// The decorator is a function that specifies this class is available to an injector for instantiation.
import { Injectable } from '@angular/core';

// Here we're importing various items used within our service.
import { RentalDetail } from '../models/rental-detail.model'; // The model or shape of a rental detail object.
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // HttpClient is used to make HTTP requests.
import { throwError, Observable, of, BehaviorSubject } from 'rxjs'; // Imports related to RxJS, a library for reactive programming using Observables.
import { catchError, map, tap } from 'rxjs/operators'; // Operators for processing Observables.
import { Lot } from '../models/lot.model';

// The @Injectable decorator marks the class as one that participates in the dependency injection system.
// The 'providedIn: 'root'' property means this service is available throughout the application.
@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private baseUrl: string = 'http://127.0.0.1:8000/leases'; // Base URL for the API.
  private rentals = new BehaviorSubject<RentalDetail[]>([]); // This BehaviorSubject holds the current value of rentals. It's like a "current state."

  rentals$ = this.rentals.asObservable(); // This creates an Observable from the BehaviorSubject to stream the data of rentals.

  // The constructor sets up the service's dependencies. In this case, it needs HttpClient for HTTP requests.
  constructor(private http: HttpClient// Assuming 0 can be a placeholder
  ) { }

  // fetchRentals is a method that fetches rental data from the server.
  fetchRentals(): Observable<RentalDetail[]> {
    return this.http.get<any[]>(this.baseUrl) // Makes a GET request to the API.
      .pipe(
        tap(data => console.log('Server response:', data)), // Log the entire server response here.
        map(data => data.map(item => this.transformResponseToModel(item))), // Transforms the raw data into our model.
        tap(rentals => this.rentals.next(rentals)) // Pushes the new rentals into our BehaviorSubject.
      );
  }

  // This method converts raw response objects into instances of the RentalDetail model.
  private transformResponseToModel(item: any): RentalDetail {
    // 'new RentalDetail' creates a new instance of RentalDetail, ensuring data shape consistency throughout the application.
    return new RentalDetail(
      // These arguments are fields expected by the RentalDetail model.
      // Each corresponds to a property of the data returned from the API.
      item.id,
      item.lot_number,
      item.lot_address,
      item.lease_holder_first_name,
      item.lease_holder_last_name,
      item.lease_holder_address,
      item.email,
      item.phone,
      parseFloat(item.monthly_rental_amount), // Convert the monthly_rental_amount from a string to a floating-point number.
      item.due_date,
      item.grace_period,
      item.lease_agreement_path,
      item.lot_image_path,
      item.payment_status
    );
  }

  private transformModelToRequest(rental: RentalDetail): any {
    return {
      id: rental.id,
      lot_number: rental.lotNumber, // assuming lotNumber is the field in your RentalDetail model
      lot_address: rental.lotAddress,
      lease_holder_first_name: rental.leaseHolderFirstName,
      lease_holder_last_name: rental.leaseHolderLastName,
      lease_holder_address: rental.leaseHolderAddress,
      email: rental.email,
      phone: rental.phone,
      monthly_rental_amount: rental.monthlyRentalAmount.toString(), // if the backend expects this as a string
      due_date: rental.dueDate,
      grace_period: rental.gracePeriod,
      // lease_agreement_path: rental.leaseAgreementPath,
      // lot_image_path: rental.lotImagePath,
      payment_status: rental.paymentStatus
      // ... any other necessary transformations
    };
  }


  // This method retrieves a specific rental detail by its identifier.
  getRentalDetailById(id: number): Observable<RentalDetail> {
    return this.http.get<RentalDetail>(`${this.baseUrl}/${id}`) // GET request to fetch data for a single rental by its ID.
      .pipe(
        map(item => this.transformResponseToModel(item)) // Transform the raw data into our RentalDetail model.
      );
  }


  // This method updates a rental detail entry.
  updateRentalDetail(rental: RentalDetail): Observable<RentalDetail> {
    const requestBody = this.transformModelToRequest(rental); // Transform the model to the request body format

    // Makes a PATCH request to the URL for the specific rental detail, passing in the updated rental detail object.
    // Note: Depending on your backend, this could be a PUT request instead of PATCH.
    return this.http.patch<any>(`${this.baseUrl}/${rental.id}/`, requestBody)
      .pipe(
        map(item => this.transformResponseToModel(item)) // Transform the response back to your model
      );
  }

  // This method is intended to "undo" a rental detail update, but specifics depend on your application's requirements.
  undoRentalDetailUpdate(rental: RentalDetail): Observable<RentalDetail> {
    // Check if rental.id is undefined
    if (rental.id === undefined) {
      // Handle the error appropriately, e.g., throw an error or return an Observable with an error
      throw new Error('Rental ID is undefined'); // This will need to be caught wherever undoRentalDetailUpdate is subscribed to.
    }
    // Since rental.id is not undefined, we can safely call getRentalDetailById
    return this.getRentalDetailById(rental.id);
  }

  addRentalDetail(rentalDetail: RentalDetail): Observable<RentalDetail> {
    return this.http.post<RentalDetail>(`${this.baseUrl}/rental-details`, rentalDetail);
  }

  addNewLease(leaseData: any): Observable<any> {
    console.log('Lease data being sent:', leaseData); // Log the leaseData to the console
    return this.http.post<any>(`${this.baseUrl}/create/`, leaseData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred while creating the lease', error.error);
        return throwError(() => new Error('Error occurred while creating the lease'));
      })
    );
  }

  getLots(): Observable<any[]> { // Replace any with your Lot type if you have one
    return this.http.get<any[]>('/lots'); // Adjust the URL to your backend endpoint
  }

  getUnoccupiedLots(): Observable<Lot[]> {
    // Assuming '/api/lots/unoccupied' returns lots where 'occupied' is false
    return this.http.get<Lot[]>(`${this.baseUrl}/lots/unoccupied`);
  }

  // return this.http.get<RentalDetail>(`${this.baseUrl}/${id}`) /
}