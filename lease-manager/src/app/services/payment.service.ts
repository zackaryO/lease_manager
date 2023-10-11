// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentApiUrl: string = 'http://api.example.com/payments'; // Replace with your actual payments API endpoint

  constructor(private http: HttpClient) { }
  recordPayment(payment: Payment): Observable<Payment> {
    // Simulate a successful response, returning the payment data as if it was created on the server
    // return this.http.post<Payment>(this.paymentApiUrl, payment);
    console.log('Pretend recordPayment to API:', payment);
    return of(payment); // Simulating the response with the same payment object
  }

  deletePayment(paymentId: number): Observable<any> {
    // Simulate a successful delete response
    // return this.http.delete(`${this.paymentApiUrl}/${paymentId}`);
    console.log('Pretend deletePayment to API for paymentId:', paymentId);
    return of({ status: 'success' }); // Simulating a successful response
  }


  // MAY BE USEFUL FOR API
  // recordPayment(payment: Payment): Observable<Payment> {
  //   return this.http.post<Payment>(this.paymentApiUrl, payment);
  // }

  // deletePayment(paymentId: number): Observable<any> {
  //   return this.http.delete(`${this.paymentApiUrl}/${paymentId}`);
}
