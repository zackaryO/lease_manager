import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

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

  getTodayMountainTime(): Date {
    // This will create a moment instance in Mountain Time Zone regardless of the user's local time zone.
    const todayMountainTime = moment().tz('America/Denver').startOf('day');
    // Convert it back to a JavaScript Date object, if needed for compatibility with other parts of your app.
    return todayMountainTime.toDate();
  }

  // Calculates the number of days past due from a given date, considering due date and grace period.
  getDaysPastDue(lastPaymentDateString: string, dueDay: number, gracePeriod: number): number {
    const lastPaymentDate = new Date(lastPaymentDateString);
    if (isNaN(lastPaymentDate.getTime())) {
      console.error('Invalid date:', lastPaymentDateString);
      return 0;
    }

    const today = this.getTodayMountainTime(); // Use a fixed date for "today's" date for calculation
    const nextDueDate = this.getNextDueDate(lastPaymentDate, dueDay);
    if (today <= nextDueDate) {
      return 0; // Not past due if today is before the next due date
    }

    const difference = today.getTime() - nextDueDate.getTime();
    const daysPastDue = Math.ceil(difference / (1000 * 3600 * 24));

    return daysPastDue;
  }
}
