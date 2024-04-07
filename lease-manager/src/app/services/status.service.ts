import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() { }

  // Adjusts the given date to the next due date based on due day and grace period
  getNextDueDate(lastPaymentDate: Date, dueDay: number): Date {
    let nextDueDate = new Date(lastPaymentDate);
    nextDueDate.setMonth(lastPaymentDate.getMonth() + 1); // Move to the next month
    nextDueDate.setDate(dueDay); // Set to due day plus grace period of the next month

    // If the due day plus grace period goes into the next month, adjust the month
    if (nextDueDate.getDate() !== (dueDay)) {
      nextDueDate = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth() + 1, 0);
    }

    return nextDueDate;
  }


  // Calculates the number of days past due from a given date, considering due date and grace period.
  getDaysPastDue(lastPaymentDateString: string, dueDay: number, gracePeriod: number): number {
    const lastPaymentDate = new Date(lastPaymentDateString);
    if (isNaN(lastPaymentDate.getTime())) {
      console.error('Invalid date:', lastPaymentDateString);
      return 0;
    }

    // Directly calculate the due date after the last payment date
    let dueDateAfterLastPayment = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, dueDay);

    // Adjusting dueDateAfterLastPayment if it went over to the next month
    if (dueDateAfterLastPayment.getDate() !== dueDay) {
      dueDateAfterLastPayment = new Date(dueDateAfterLastPayment.getFullYear(), dueDateAfterLastPayment.getMonth(), 0);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate day difference calculation

    // Convert both dates to timestamps for subtraction
    const difference = today.getTime() - dueDateAfterLastPayment.getTime();

    // Calculate the difference in days
    const daysPastDue = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysPastDue;
  }

}
