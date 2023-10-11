// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentApiUrl: string = 'http://api.example.com/payments'; // Replace with your actual payments API endpoint

  constructor(private http: HttpClient) { }

  recordPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.paymentApiUrl, payment);
  }

  deletePayment(paymentId: number): Observable<any> {
    return this.http.delete(`${this.paymentApiUrl}/${paymentId}`);
  }
}
