import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Payment } from '../models/payment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://leasemanager-env.us-east-1.elasticbeanstalk.com/api/payments/';  // replace with your API endpoint
  // private baseUrl = 'http://127.0.0.1:8000/api/payments/';  // replace with your API endpoint

  constructor(private http: HttpClient, private authService: AuthService) { }

  private transformModelToRequest(payment: Payment): FormData {
    const formData = new FormData();
    const headers = this.getHeaders();
    // Check if payment and payment.leaseId are defined before appending to formData
    if (payment && payment.leaseId) {
      formData.append('lease', payment.leaseId.toString());
    } else {
      console.error('leaseId is missing from the payment object:', payment);
      throw new Error('leaseId is missing from the payment object');
    }

    formData.append('payment_date', payment.payment_date);
    formData.append('payment_amount', payment.payment_amount ? payment.payment_amount.toString() : '');
    formData.append('payment_method', payment.payment_method);

    // Optional fields
    if (payment.transaction_id) {
      formData.append('transaction_id', payment.transaction_id);
    }

    if (payment.notes) {
      formData.append('notes', payment.notes);
    }

    if (payment.receipt) {
      formData.append('receipt', payment.receipt, payment.receipt.name);
    }

    return formData;
  }

  private getHeaders(): HttpHeaders {
    const authToken = this.authService.getAuthToken();
    return new HttpHeaders({
      'Authorization': authToken ? `Bearer ${authToken}` : '',
    });
  }

  submitPayment(payment: Payment): Observable<any> {
    // Before calling transformModelToRequest, check if leaseId is available in the payment object
    if (!payment.leaseId) {
      console.error('Error in submitPayment: leaseId is missing', payment);
      throw new Error('Error in submitPayment: leaseId is missing');
    }
    const formData = this.transformModelToRequest(payment);
    const headers = this.getHeaders();
    for (let [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    return this.http.post(this.baseUrl, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Server error in submitPayment:', error.message);
          return throwError(error); // rethrow the error to keep the observable in an error state
        })
      );
  }


  deletePayment(paymentId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/${paymentId}`, { headers });  // assuming a DELETE request is needed
  }


  getPayments(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl, { headers })
      .pipe(
        tap((response: any) => console.log('Data response:', response))

      );
  }

  deletePayments(ids: number[]): Observable<any> {
    const headers = this.getHeaders();
    const deleteUrl = `${this.baseUrl}delete/`; // Adjust based on your backend DELETE endpoint
    return this.http.post(deleteUrl, { ids }, { headers });
  }


}
