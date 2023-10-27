import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://127.0.0.1:8000/payments/';  // replace with your API endpoint

  constructor(private http: HttpClient) { }

  private transformModelToRequest(payment: Payment): FormData {
    const formData = new FormData();

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

  submitPayment(payment: Payment): Observable<any> {
    // Before calling transformModelToRequest, check if leaseId is available in the payment object
    if (!payment.leaseId) {
      console.error('Error in submitPayment: leaseId is missing', payment);
      throw new Error('Error in submitPayment: leaseId is missing');
    }
    const formData = this.transformModelToRequest(payment);
    for (let [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    return this.http.post(this.baseUrl, formData);
  }

  deletePayment(paymentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${paymentId}`);  // assuming a DELETE request is needed
  }
}
