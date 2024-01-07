// rental-detail.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RentalDetail } from '../models/rental-detail.model';
import { Lot } from '../models/lot.model';
import { Lease } from '../models/lease.model';
import { LeaseHolder } from '../models/lease-holder.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private baseUrl: string = 'http://127.0.0.1:8000/leases';
  private rentals = new BehaviorSubject<RentalDetail[]>([]);
  rentals$ = this.rentals.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const authToken = this.authService.getAuthToken();
    return new HttpHeaders({
      'Authorization': authToken ? `Bearer ${authToken}` : '',
    });
  }

  private transformResponseToModel(item: any): RentalDetail {
    return new RentalDetail(
      item.id,
      item.lot_number,
      item.lot_address,
      item.lease_holder_first_name,
      item.lease_holder_last_name,
      item.lease_holder_address,
      item.email,
      item.phone,
      parseFloat(item.monthly_rental_amount),
      item.due_date,
      item.grace_period,
      item.lease_agreement_path,
      item.lot_image_path,
      item.last_payment_date,
      item.payment_status
    );
  }

  private transformModelToRequest(rental: RentalDetail): any {
    return {
      id: rental.id,
      lot_number: rental.lotNumber,
      lot_address: rental.lotAddress,
      lease_holder_first_name: rental.leaseHolderFirstName,
      lease_holder_last_name: rental.leaseHolderLastName,
      lease_holder_address: rental.leaseHolderAddress,
      email: rental.email,
      phone: rental.phone,
      monthly_rental_amount: rental.monthlyRentalAmount.toString(),
      due_date: rental.dueDate,
      grace_period: rental.gracePeriod,
      payment_status: rental.paymentStatus
    };
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    console.error('Server error:', error);
    return throwError(() => new Error('A server error occurred'));
  }

  fetchLeases(): Observable<Lease[]> {
    const headers = this.getHeaders();
    return this.http.get<Lease[]>(`${this.baseUrl}/leases`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch lease by ID
  getLeaseById(id: number): Observable<Lease> {
    const headers = this.getHeaders();
    return this.http.get<Lease>(`${this.baseUrl}/leases/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update lease
  updateLease(lease: Lease): Observable<Lease> {
    const headers = this.getHeaders();
    return this.http.put<Lease>(`${this.baseUrl}/leases/${lease.id}/`, lease, { headers })
      .pipe(catchError(this.handleError));
  }

  // Add new lease
  addLease(lease: Lease): Observable<Lease> {
    const headers = this.getHeaders();
    return this.http.post<Lease>(`${this.baseUrl}/leases/`, lease, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete lease
  deleteLease(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/leases/${id}/`, { headers })
      .pipe(catchError(this.handleError));
  }

  fetchRentals(): Observable<RentalDetail[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.baseUrl, { headers })
      .pipe(
        tap(data => console.log('Server response:', data)),
        map(data => data.map(item => this.transformResponseToModel(item))),
        tap(rentals => this.rentals.next(rentals))
      );
  }

  getRentalDetailById(id: number): Observable<RentalDetail> {
    const headers = this.getHeaders();
    return this.http.get<RentalDetail>(`${this.baseUrl}/${id}`, { headers })
      .pipe(
        map(item => this.transformResponseToModel(item))
      );
  }

  updateRentalDetail(rental: RentalDetail): Observable<RentalDetail> {
    const headers = this.getHeaders();
    const requestBody = this.transformModelToRequest(rental);
    return this.http.patch<any>(`${this.baseUrl}/${rental.id}/`, requestBody, { headers })
      .pipe(
        map(item => this.transformResponseToModel(item))
      );
  }

  undoRentalDetailUpdate(rental: RentalDetail): Observable<RentalDetail> {
    if (rental.id === undefined) {
      throw new Error('Rental ID is undefined');
    }
    return this.getRentalDetailById(rental.id);
  }

  addRentalDetail(rentalDetail: RentalDetail): Observable<RentalDetail> {
    const headers = this.getHeaders();
    return this.http.post<RentalDetail>(`${this.baseUrl}/rental-details`, rentalDetail, { headers });
  }

  addNewLease(leaseData: FormData): Observable<any> {
    const transformedLeaseData = new FormData();
    leaseData.forEach((value, key) => {
      // Here, transform the value if necessary. 
      // For example, if the 'monthly_rental_amount' needs to be converted to a string:
      if (key === 'monthly_rental_amount') {
        transformedLeaseData.append(key, value.toString());
      } else {
        transformedLeaseData.append(key, value);
      }
      // Add similar conditions for other fields that need transformation
    });

    const headers = this.getHeaders().delete('Content-Type');
    return this.http.post<any>(`${this.baseUrl}/create/`, transformedLeaseData, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred while creating the lease', error.error);
          return throwError(() => new Error('Error occurred while creating the lease'));
        })
      );
  }

  getLotById(id: number): Observable<Lot> {
    return this.http.get<Lot>(`${this.baseUrl}/lots/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Fetch all lots
  getLots(): Observable<Lot[]> {
    const headers = this.getHeaders();
    return this.http.get<Lot[]>(`${this.baseUrl}/lots`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch unoccupied lots
  getUnoccupiedLots(): Observable<Lot[]> {
    const headers = this.getHeaders();
    return this.http.get<Lot[]>(`${this.baseUrl}/lots/unoccupied`, { headers })
      .pipe(catchError(this.handleError));
  }

  addLot(lot: Lot): Observable<Lot> {
    return this.http.post<Lot>(`${this.baseUrl}/lots/`, lot, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateLot(lot: Lot): Observable<Lot> {
    return this.http.put<Lot>(`${this.baseUrl}/lots/${lot.id}/`, lot, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteLot(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/lots/${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Fetch lease holders
  fetchLeaseHolders(): Observable<LeaseHolder[]> {
    const headers = this.getHeaders();
    return this.http.get<LeaseHolder[]>(`${this.baseUrl}/lease_holder`, { headers })
      .pipe(catchError(this.handleError));
  }

  // API not built
  getLeaseHolderById(id: number): Observable<LeaseHolder> {
    return this.http.get<LeaseHolder>(`${this.baseUrl}/leaseholders/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // API not built
  addLeaseHolder(leaseHolder: LeaseHolder): Observable<LeaseHolder> {
    return this.http.post<LeaseHolder>(`${this.baseUrl}/leaseholders/`, leaseHolder, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // API not built
  updateLeaseHolder(leaseHolder: LeaseHolder): Observable<LeaseHolder> {
    return this.http.put<LeaseHolder>(`${this.baseUrl}/leaseholders/${leaseHolder.id}/`, leaseHolder, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // API not built
  deleteLeaseHolder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/leaseholders/${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

}
