import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://127.0.0.1:8000/payment';  // replace with your API endpoint

  constructor(private http: HttpClient) { }

  private transformModelToRequest(payment: Payment): FormData {
    const formData = new FormData();

    formData.append('lease', payment.leaseId.toString());
    formData.append('payment_date', payment.payment_date);
    formData.append('payment_amount', payment.payment_amount.toString());
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
    const formData = this.transformModelToRequest(payment);
    return this.http.post(this.baseUrl, formData);
  }

  deletePayment(paymentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${paymentId}`);  // assuming a DELETE request is needed
  }
}
