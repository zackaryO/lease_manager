import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  payments: any[] = [];
  selectedPayments: any[] = [];

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data;
    });
  }

  toggleSelection(payment: any) {
    const idx = this.selectedPayments.indexOf(payment.id);
    if (idx > -1) {
      this.selectedPayments.splice(idx, 1);
    } else {
      this.selectedPayments.push(payment.id);
    }
  }

  deleteSelected() {
    this.paymentService.deletePayments(this.selectedPayments).subscribe(() => {
      this.payments = this.payments.filter(p => !this.selectedPayments.includes(p.id));
      this.selectedPayments = [];
    });
  }

  printReport() {
    window.print();
  }
}
