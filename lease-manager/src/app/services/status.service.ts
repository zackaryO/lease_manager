import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() { }


  // Calculates the number of days past due from a given date.
  getDaysPastDue(dateString: string | Date): number {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 0;
    }

    const today = new Date();
    const difference = today.getTime() - date.getTime();
    const daysPastDue = Math.ceil(difference / (1000 * 3600 * 24));

    return daysPastDue > 30 ? daysPastDue - 30 : 0; // Custom logic adjustment as per requirements
  }


}
