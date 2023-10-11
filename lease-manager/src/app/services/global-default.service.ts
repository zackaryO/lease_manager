// global-default.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GlobalDefault } from '../models/global-default.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalDefaultService {
  // This is a placeholder for your actual API call
  private globalDefaults: GlobalDefault = new GlobalDefault({
    dueDate: new Date(),
    lateFee: 50,
    daysLate: 3,
    dayDelinquent: 5
  });

  constructor() { }

  getGlobalDefault(): Observable<GlobalDefault> {
    // Here, you would make a GET request to fetch the global defaults
    // return this.http.get<GlobalDefault>(this.apiUrl);
    return of(this.globalDefaults); // Mock data
  }

  updateGlobalDefault(data: any): Observable<any> {
    // Here, you would make a POST or PUT request to update the global defaults
    // return this.http.post(this.apiUrl, data);
    Object.assign(this.globalDefaults, data); // Mock update
    return of({ status: 'success' }); // Mock response
  }
}
