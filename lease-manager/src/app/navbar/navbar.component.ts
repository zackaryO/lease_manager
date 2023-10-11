// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { GlobalDefault } from '../models/global-default.model';
import { GlobalDefaultService } from '../services/global-default.service';
import { ComponentCanDeactivate } from '../unsaved-changes.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, ComponentCanDeactivate {
  globalDefault: GlobalDefault = new GlobalDefault();
  updatedGlobalDefault: GlobalDefault = new GlobalDefault();
  daysInMonth: number[] = [];  // Define the daysInMonth array

  constructor(private globalDefaultService: GlobalDefaultService) { }

  ngOnInit(): void {
    this.fillDaysInMonth();  // Fill the daysInMonth array when the component initializes
    // Fetch the current settings on component initialization
    this.globalDefaultService.getGlobalDefault().subscribe(
      globalDefault => {
        this.globalDefault = globalDefault;
        this.updatedGlobalDefault = GlobalDefault.deserialize(globalDefault.serialize());
      },
      error => {
        console.error('Error fetching global defaults:', error);
      }
    );
  }

  canDeactivate(): boolean {
    // logic to determine if there are changes
    if (JSON.stringify(this.globalDefault) === JSON.stringify(this.updatedGlobalDefault)) {
      return true; // no changes, allow deactivation
    } else {
      return false; // there are unsaved changes, ask for confirmation
    }
  }

  loadGlobalDefaults(): void {
    // Placeholder for method to load current settings from server
    // this.globalDefaultService.getGlobalDefaults().subscribe(data => {
    //   this.globalDefault = GlobalDefault.deserialize(data);
    // });
  }

  onDueDayChange(newDueDay: number): void {
    this.globalDefault.dueDay = newDueDay;
    // You might want to update the server with the new due day here
    // this.globalDefaultService.updateGlobalDefault(this.globalDefault.serialize()).subscribe();
  }

  saveUpdates(): void {
    // Confirm before saving
    const confirmation = confirm('Do you want to save these changes?');
    if (confirmation) {
      // Logic to save the updates, e.g., send them to a service or backend
      this.globalDefaultService.updateGlobalDefault(this.updatedGlobalDefault.serialize()).subscribe(
        () => {
          console.log('Update successful', Response);
          alert('Changes saved successfully.'); // Optional success message
        },
        error => {
          console.error('An error occurred while updating settings.', error);
          alert('An error occurred while saving changes.'); // Optional error message
        }
      );
    }
  }



  fillDaysInMonth(): void {
    // This is a simple way to fill out the days in a month. This does not account for different days in different months.
    // If you need to account for different days in each month, you will need additional logic.
    for (let i = 1; i <= 31; i++) {
      this.daysInMonth.push(i);
    }
  }
}




